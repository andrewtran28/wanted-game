const { Router } = require("express");
const gameRouter = Router();
const gameController = require("../controllers/gameController");

gameRouter.post("/start-level", gameController.startLevel);
gameRouter.post("/end-level", gameController.endLevel);

module.exports = gameRouter;
