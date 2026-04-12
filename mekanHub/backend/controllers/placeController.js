const placeService = require("../services/placeService");
const createPlaceDto = require("../dtos/createPlaceDto");
const placeResponseDto = require("../dtos/placeResponseDto");

async function getPlaces(req, res) {
  try {
    const places = await placeService.getAllPlaces();
    const response = places.map(placeResponseDto);

    res.status(200).json(response);
  } catch (error) {
    console.error("GET PLACES ERROR:", error);
    res.status(500).json({
      message: "Places could not be fetched",
    });
  }
}

async function addPlace(req, res) {
  try {
    const dto = createPlaceDto(req.body);

    if (!dto.createdByUserId || !dto.name || !dto.location) {
      return res.status(400).json({
        message: "createdByUserId, name and location are required",
      });
    }

    const createdPlace = await placeService.createPlace(dto);
    const response = placeResponseDto(createdPlace);

    res.status(201).json(response);
  } catch (error) {
    console.error("ADD PLACE ERROR:", error);
    res.status(500).json({
      message: "Place could not be added",
    });
  }
}

module.exports = {
  getPlaces,
  addPlace,
};