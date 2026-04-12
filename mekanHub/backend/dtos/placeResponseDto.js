function placeResponseDto(place) {
  return {
    id: place.Id,
    createdByUserId: place.CreatedByUserId,
    name: place.Name,
    location: place.Location,
    desc: place.Description,
    rating: place.AverageRating,
    createdAt: place.CreatedAt,
  };
}

module.exports = placeResponseDto;