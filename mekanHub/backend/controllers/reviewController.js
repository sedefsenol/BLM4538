const reviewService = require("../services/reviewService");

async function addReview(req, res) {
  try {
    const result = await reviewService.addReview(req.body);

    res.status(201).json({
      message: "Review added successfully",
      data: result
    });
  } catch (error) {
    console.log("ADD REVIEW ERROR:", error);

    res.status(500).json({
      message: "Review could not be added"
    });
  }
}

async function getReviewsByPlace(req, res) {
  try {
    const placeId = req.params.placeId;

    const reviews = await reviewService.getReviewsByPlace(placeId);

    res.status(200).json(reviews);
  } catch (error) {
    console.log("GET REVIEWS ERROR:", error);

    res.status(500).json({
      message: "Reviews could not be fetched"
    });
  }
}

module.exports = {
  addReview,
  getReviewsByPlace
};