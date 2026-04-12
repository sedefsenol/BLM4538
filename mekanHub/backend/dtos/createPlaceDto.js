function createPlaceDto(body) {
  return {
    createdByUserId: Number(body.createdByUserId),
    name: body.name?.trim(),
    location: body.location?.trim(),
    description: body.description?.trim() || "",
  };
}

module.exports = createPlaceDto;