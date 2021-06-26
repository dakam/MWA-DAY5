
const express = require("express");
const controllerGames = require("../controllers/gamesController");
const controllerPublisher = require("../controllers/gamepublisherController");

const router = express.Router();


router.route("/games")
    .get(controllerGames.GamesGetAll)
    .post(controllerGames.gamesAddOne);

router.route("/games/:gameId")
    .get(controllerGames.GamesGetOne)
    .patch(controllerGames.GamesPartialUpdateOne)
    .delete(controllerGames.GamesDeleteOne)
    .put(controllerGames.gamesFullUpdateOne)

router.route("/games/:gameId/publishers")
    .post(controllerPublisher.publisherAddOne);


router.route("/games/:gameId/publishers/:publisherId")
.get(controllerPublisher.publisherGetOne)
.put(controllerPublisher.publisherFullUpdateOne)
.delete(controllerPublisher.publisherDeleteOne);






module.exports = router;
