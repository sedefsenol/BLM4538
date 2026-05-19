const axios = require("axios");
const { pool, poolConnect } = require("../db");
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
    res.status(500).json({ message: "Places could not be fetched" });
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
    res.status(500).json({ message: "Place could not be added" });
  }
}

async function getPlaceById(req, res) {
  try {
    const id = req.params.id;
    const place = await placeService.getPlaceById(id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const response = placeResponseDto(place);
    res.status(200).json(response);
  } catch (error) {
    console.error("GET PLACE DETAIL ERROR:", error);
    res.status(500).json({ message: "Error" });
  }
}

async function getNearbyCafes(req, res) {
  try {
    const bolgeler = [
      "Gölbaşı Ankara cafe",
      "İncek Ankara cafe",
      "Kızılay Ankara cafe",
      "Bahçelievler Ankara cafe",
      "Tunalı Ankara cafe",
      "Çankaya Ankara cafe",
      "Emek Ankara cafe",
      "Beşevler Ankara cafe",
      "Ümitköy Ankara cafe",
      "Çayyolu Ankara cafe",
      "Batıkent Ankara cafe",
      "Keçiören Ankara cafe",
      "Etimesgut Ankara cafe",
      "Mamak Ankara cafe",
    ];

    const requests = bolgeler.map((query) =>
      axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
        params: {
          query,
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      })
    );

    const responses = await Promise.all(requests);
    const allPlaces = responses.flatMap((response) => response.data.results);

    const uniquePlaces = Array.from(
      new Map(allPlaces.map((place) => [place.place_id, place])).values()
    );

    await poolConnect;

    const dbPlacesResult = await pool.request().query(`
      SELECT
        p.Id,
        p.Name,
        ISNULL(AVG(CAST(r.OverallScore AS FLOAT)), 0) AS averageRating,
        COUNT(r.Id) AS reviewCount
      FROM Places p
      LEFT JOIN PlaceReviews r ON p.Id = r.PlaceId
      GROUP BY
        p.Id,
        p.Name
    `);

    const dbPlaces = dbPlacesResult.recordset;

    const cafes = uniquePlaces.map((place) => {
      const photoReference = place.photos?.[0]?.photo_reference;

      const dbPlace = dbPlaces.find(
        (p) =>
          String(p.Name || "").toLowerCase().trim() ===
          String(place.name || "").toLowerCase().trim()
      );

      return {
        id: place.place_id,
        googlePlaceId: place.place_id,
        name: place.name,
        description: place.formatted_address || place.vicinity || "",
        location: place.formatted_address || place.vicinity || "",
        averageRating: dbPlace ? Number(dbPlace.averageRating) : 0,
        reviewCount: dbPlace ? Number(dbPlace.reviewCount) : 0,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        imageUrl: photoReference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photo_reference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
          : null,
      };
    });

    res.status(200).json(cafes);
  } catch (error) {
    console.error("GOOGLE PLACES ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Kafeler alınamadı" });
  }
}

async function saveGooglePlace(req, res) {
  try {
    const {
      name,
      location,
      description,
      latitude,
      longitude,
      googlePlaceId,
      imageUrl,
    } = req.body;

    const places = await placeService.getAllPlaces();

    const existingPlace = places.find(
      (p) =>
        p.GooglePlaceId === googlePlaceId ||
        p.googlePlaceId === googlePlaceId ||
        p.Name === name ||
        p.name === name
    );

    if (existingPlace) {
      return res.status(200).json(placeResponseDto(existingPlace));
    }

    const dto = {
      createdByUserId: 4,
      name,
      location,
      description,
      averageRating: 0,
      latitude,
      longitude,
      googlePlaceId,
      imageUrl,
    };

    const createdPlace = await placeService.createPlace(dto);
    const response = placeResponseDto(createdPlace);

    res.status(201).json(response);
  } catch (error) {
    console.error("SAVE GOOGLE PLACE ERROR:", error);
    res.status(500).json({ message: "Google mekanı kaydedilemedi" });
  }
}

module.exports = {
  getPlaces,
  addPlace,
  getPlaceById,
  getNearbyCafes,
  saveGooglePlace,
};