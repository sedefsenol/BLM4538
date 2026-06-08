const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.addReview);
router.get("/latest", reviewController.getLatestReviews);
router.get("/popular-places", reviewController.getPopularPlaces);

router.get("/user/:userId", reviewController.getUserReviews);
router.post("/vote", reviewController.voteReview);

module.exports = router;