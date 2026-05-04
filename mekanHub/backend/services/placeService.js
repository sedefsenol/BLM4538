const { pool, poolConnect, sql } = require("../db");

async function getAllPlaces() {
  await poolConnect;

  const result = await pool.request().query(`
    SELECT 
      Id, CreatedByUserId, Name, Location, Description, CreatedAt
    FROM Places
    ORDER BY Id DESC
  `);

  return result.recordset;
}

async function createPlace(place) {
  await poolConnect;

  const result = await pool
    .request()
    .input("CreatedByUserId", sql.Int, place.createdByUserId)
    .input("Name", sql.NVarChar, place.name)
    .input("Location", sql.NVarChar, place.location)
    .input("Description", sql.NVarChar, place.description)
    .query(`
      INSERT INTO Places (CreatedByUserId, Name, Location, Description)
      OUTPUT INSERTED.Id, INSERTED.CreatedByUserId, INSERTED.Name, INSERTED.Location, INSERTED.Description, INSERTED.AverageRating, INSERTED.CreatedAt
      VALUES (@CreatedByUserId, @Name, @Location, @Description)
    `);

  return result.recordset[0];
}

async function getPlaceById(id) {
  await poolConnect;

  const placeResult = await pool.request()
    .input("Id", sql.Int, id)
    .query(`
      SELECT 
        Id, CreatedByUserId, Name, Location, Description, CreatedAt
      FROM Places
      WHERE Id = @Id
    `);

  const place = placeResult.recordset[0];

  if (!place) return null;

  const reviewResult = await pool.request()
    .input("Id", sql.Int, id)
    .query(`
      SELECT 
        COUNT(*) AS reviewCount,
        AVG(CAST(OverallScore AS FLOAT)) AS averageRating
      FROM PlaceReviews
      WHERE PlaceId = @Id
    `);

  const stats = reviewResult.recordset[0];

  return {
    ...place,
    reviewCount: stats.reviewCount,
    averageRating: stats.averageRating || 0
  };
}

module.exports = {
  getAllPlaces,
  createPlace,
  getPlaceById,
};