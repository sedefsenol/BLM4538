const { pool, poolConnect, sql } = require("../db");

async function addReview(review) {
  await poolConnect;

  const overallScore =
    (
      review.quietnessScore +
      review.wifiScore +
      review.socketScore +
      review.comfortScore +
      review.crowdednessScore
    ) ;

  const result = await pool
    .request()
    .input("PlaceId", sql.Int, review.placeId)
    .input("UserId", sql.Int, review.userId)
    .input("QuietnessScore", sql.Int, review.quietnessScore)
    .input("WifiScore", sql.Int, review.wifiScore)
    .input("SocketScore", sql.Int, review.socketScore)
    .input("ComfortScore", sql.Int, review.comfortScore)
    .input("CrowdednessScore", sql.Int, review.crowdednessScore)
    .input("OverallScore", sql.Float, overallScore)
    .query(`
      INSERT INTO PlaceReviews (
        PlaceId,
        UserId,
        QuietnessScore,
        WifiScore,
        SocketScore,
        ComfortScore,
        CrowdednessScore,
        OverallScore
      )
      OUTPUT INSERTED.*
      VALUES (
        @PlaceId,
        @UserId,
        @QuietnessScore,
        @WifiScore,
        @SocketScore,
        @ComfortScore,
        @CrowdednessScore,
        @OverallScore
      )
    `);

  return result.recordset[0];
}


async function getReviewsByPlace(placeId) {
  await poolConnect;

  const result = await pool
    .request()
    .input("PlaceId", sql.Int, placeId)
    .query(`
      SELECT *
      FROM PlaceReviews
      WHERE PlaceId = @PlaceId
      ORDER BY CreatedAt DESC
    `);

  return result.recordset;
}

module.exports = {
  addReview,
  getReviewsByPlace
};