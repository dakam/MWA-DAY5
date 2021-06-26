
const express = require("express");
const controllerGames = require("../controllers/gamesController");


const router = express.Router();

//Game
router.route("/games")
    .get(controllerGames.GamesGetAll)
    .post(controllerGames.gamesAddOne);

router.route("/games/:gameId")
    .get(controllerGames.GamesGetOne)
    .patch(controllerGames.GamesPartialUpdateOne)
    .delete(controllerGames.GamesDeleteOne)
    .put(controllerGames.gamesFullUpdateOne)






module.exports = router;
