const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { score: "desc" },
      take: 10,
    });
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error); // Logs the specific error
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

const submitScoreEntry = async (req, res) => {
  try {
    const { sessionId, username } = req.body;

    if (!sessionId || !username || !activeGames[sessionId]) {
      return res.status(400).json({ error: "Invalid session or username" });
    }

    const game = activeGames[sessionId];
    delete activeGames[sessionId]; // Remove session data after submission

    const newEntry = await prisma.leaderboard.create({
      data: { username, score: game.score },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getLeaderboard,
  submitScoreEntry,
};
