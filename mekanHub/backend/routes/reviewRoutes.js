const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");


router.post("/", reviewController.addReview);
router.get("/:placeId", reviewController.getReviewsByPlace);

module.exports = router;