const { pool, poolConnect, sql } = require("../db");

async function getAllPlaces() {
  await poolConnect;

  const result = await pool.request().query(`
    SELECT Id, CreatedByUserId, Name, Location, Description, AverageRating, CreatedAt
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

module.exports = {
  getAllPlaces,
  createPlace,
};