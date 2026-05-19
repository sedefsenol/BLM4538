function placeResponseDto(place) {
  return {
    id: place.Id || place.id,
    createdByUserId: place.CreatedByUserId || place.createdByUserId,

    name: place.Name || place.name,
    location: place.Location || place.location,
    description: place.Description || place.description,

    averageRating:
      place.averageRating ||
      place.AverageRating ||
      place.rating ||
      0,

    reviewCount:
      place.reviewCount ||
      place.ReviewCount ||
      0,

    createdAt: place.CreatedAt || place.createdAt,
    imageUrl: place.ImageUrl || place.imageUrl,

    reviews: place.reviews || [],
  };
}

module.exports = placeResponseDto;