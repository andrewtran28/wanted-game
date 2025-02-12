const { Router } = require("express");
const leaderboardRouter = Router();
const leaderboardController = require("../controllers/leaderboardController");

leaderboardRouter.get("/", leaderboardController.getLeaderboard);
leaderboardRouter.post("/", leaderboardController.submitScoreEntry);

module.exports = leaderboardRouter;
