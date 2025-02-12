const generateIcons = require("../utils/difficulty");

let gameSessions = {}; // Store session data

// Start a new level and generate icons
const startLevel = (req, res) => {
  const { sessionId, level } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Session ID required" });

  const { icons, targetIndex } = generateIcons(level);
  gameSessions[sessionId] = {
    level,
    targetIndex,
    startTime: Date.now(),
    icons,
    timeLeft: 30, // Initial time limit
  };

  res.json({ icons, target: targetIndex, timeLeft: 30, message: `Level ${level} started for session ${sessionId}` });
};

// Validate time and process successful click
const processClick = (req, res) => {
  const { sessionId, reactionTime } = req.body;
  if (!sessionId || !gameSessions[sessionId]) return res.status(400).json({ error: "Invalid session" });

  let { timeLeft } = gameSessions[sessionId];
  const maxAllowedTime = 30 + gameSessions[sessionId].level * 2;

  if (reactionTime > maxAllowedTime) {
    return res.status(400).json({ error: "Invalid time detected" });
  }

  timeLeft = Math.min(timeLeft + 2, maxAllowedTime);
  gameSessions[sessionId].timeLeft = timeLeft;

  res.json({ timeLeft, message: "Success! Time updated." });
};

// End level and return final game data
const endLevel = (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId || !gameSessions[sessionId]) return res.status(400).json({ error: "Invalid session" });

  const { startTime, timeLeft } = gameSessions[sessionId];
  const reactionTime = (Date.now() - startTime) / 1000; // Convert to seconds
  delete gameSessions[sessionId]; // Clean up session

  res.json({ reactionTime, timeLeft, message: "Game session ended." });
};

module.exports = { startLevel, processClick, endLevel };
