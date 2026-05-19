const { pool, poolConnect, sql } = require("../db");

async function getAllPlaces() {
  await poolConnect;

  const result = await pool.request().query(`
    SELECT 
      Id, CreatedByUserId, Name, Location, Description, AverageRating, CreatedAt, ImageUrl
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
    .input("AverageRating", sql.Float, place.averageRating || 0)
    .input("ImageUrl", sql.NVarChar, place.imageUrl || null)
    .query(`
      INSERT INTO Places 
      (
        CreatedByUserId, 
        Name, 
        Location, 
        Description,
        AverageRating,
        ImageUrl
      )
      OUTPUT 
        INSERTED.Id, 
        INSERTED.CreatedByUserId, 
        INSERTED.Name, 
        INSERTED.Location, 
        INSERTED.Description, 
        INSERTED.AverageRating, 
        INSERTED.CreatedAt,
        INSERTED.ImageUrl
      VALUES 
      (
        @CreatedByUserId, 
        @Name, 
        @Location, 
        @Description,
        @AverageRating,
        @ImageUrl
      )
    `);

  return result.recordset[0];
}

async function getPlaceById(id) {
  await poolConnect;

  const placeResult = await pool
    .request()
    .input("Id", sql.Int, id)
    .query(`
      SELECT 
        Id, CreatedByUserId, Name, Location, Description, AverageRating, CreatedAt, ImageUrl
      FROM Places
      WHERE Id = @Id
    `);

  const place = placeResult.recordset[0];

  if (!place) return null;

  const reviewResult = await pool
    .request()
    .input("Id", sql.Int, id)
    .query(`
      SELECT 
        r.Id AS id,
        r.PlaceId AS placeId,
        r.UserId AS userId,
        r.OverallScore AS rating,
        r.Comment AS comment,
        r.CreatedAt AS createdAt,
        u.FullName AS fullName
      FROM PlaceReviews r
      LEFT JOIN Users u ON r.UserId = u.Id
      WHERE r.PlaceId = @Id
      ORDER BY r.CreatedAt DESC
    `);

  const statsResult = await pool
    .request()
    .input("Id", sql.Int, id)
    .query(`
      SELECT 
        COUNT(*) AS reviewCount,
        AVG(CAST(OverallScore AS FLOAT)) AS averageRating
      FROM PlaceReviews
      WHERE PlaceId = @Id
    `);

  const stats = statsResult.recordset[0];

  return {
    ...place,
    reviewCount: stats.reviewCount,
    averageRating: stats.averageRating || 0,
    reviews: reviewResult.recordset,
  };
}

module.exports = {
  getAllPlaces,
  createPlace,
  getPlaceById,
};