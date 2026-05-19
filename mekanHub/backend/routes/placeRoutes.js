const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");

router.get("/", placeController.getPlaces);
router.post("/", placeController.addPlace);

router.get("/nearby-cafes", placeController.getNearbyCafes);
router.post("/google-save", placeController.saveGooglePlace);

router.get("/:id", placeController.getPlaceById);

module.exports = router;