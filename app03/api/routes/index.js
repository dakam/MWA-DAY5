
const express = require("express");
const controllerGames = require("../controllers/gamesController");
const controllerPublisher = require("../controllers/gamepublisherController");
const ControllerReviews = require("../controllers/gameReviewsController")

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
    .post(controllerPublisher.publisherAddOne)
    .get(controllerPublisher.publisherGetOne);


router.route("/games/:gameId/publishers/:publisherId")

.put(controllerPublisher.publisherFullUpdateOne)
.delete(controllerPublisher.publisherDeleteOne);

router.route("/games/:gameId/reviews")
.post(ControllerReviews.ReviewAddOne)
.get(ControllerReviews.ReviewsGetAll)
.put(ControllerReviews.ReviewsFullUpdateAll)
.delete(ControllerReviews.ReviewDeleteOne)

module.exports = router;
