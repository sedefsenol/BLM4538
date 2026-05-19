const { sql, pool, poolConnect } = require("../db");

async function addReview(req, res) {
  try {
    await poolConnect;

    const {
      placeId,
      userId,
      comment,
      quietnessScore,
      wifiScore,
      socketScore,
      comfortScore,
      crowdednessScore,
      overallScore,
      rating,
    } = req.body;

    const finalScore = overallScore || rating;

    await pool
      .request()
      .input("PlaceId", sql.Int, placeId)
      .input("UserId", sql.Int, userId)
      .input("QuietnessScore", sql.Int, quietnessScore)
      .input("WifiScore", sql.Int, wifiScore)
      .input("SocketScore", sql.Int, socketScore)
      .input("ComfortScore", sql.Int, comfortScore)
      .input("OverallScore", sql.Decimal(5, 2), finalScore)
      .input("Comment", sql.NVarChar, comment || "")
      .input("CrowdednessScore", sql.Int, crowdednessScore)
      .query(`
        INSERT INTO PlaceReviews
        (
          PlaceId,
          UserId,
          QuietnessScore,
          WifiScore,
          SocketScore,
          ComfortScore,
          OverallScore,
          Comment,
          CreatedAt,
          CrowdednessScore
        )
        VALUES
        (
          @PlaceId,
          @UserId,
          @QuietnessScore,
          @WifiScore,
          @SocketScore,
          @ComfortScore,
          @OverallScore,
          @Comment,
          GETDATE(),
          @CrowdednessScore
        )
      `);

  
    await pool
      .request()
      .input("PlaceId", sql.Int, placeId)
      .query(`
        UPDATE Places
        SET AverageRating = (
          SELECT AVG(CAST(OverallScore AS FLOAT))
          FROM PlaceReviews
          WHERE PlaceId = @PlaceId
        )
        WHERE Id = @PlaceId
      `);

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);
    res.status(500).json({ message: "Review could not be added" });
  }
}
async function getLatestReviews(req, res) {
  try {
    await poolConnect;

    const result = await pool.request().query(`
      SELECT TOP 5
        r.Id AS id,
        r.Comment AS comment,
        r.OverallScore AS rating,
        r.CreatedAt AS createdAt,
        u.FullName AS fullName,
        p.Name AS placeName,
        p.Id AS placeId
      FROM PlaceReviews r
      INNER JOIN Users u ON r.UserId = u.Id
      INNER JOIN Places p ON r.PlaceId = p.Id
      ORDER BY r.CreatedAt DESC
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("GET LATEST REVIEWS ERROR:", error);
    res.status(500).json({ message: "Latest reviews could not be fetched" });
  }
}

async function getPopularPlaces() {
  await poolConnect;

  const result = await pool.request().query(`
    SELECT TOP 5
      p.Id AS id,
      p.Name AS name,
      p.Location AS location,
      p.Description AS description,
      p.ImageUrl AS imageUrl,
      ISNULL(AVG(CAST(r.OverallScore AS FLOAT)), 0) AS averageRating,
      COUNT(r.Id) AS reviewCount
    FROM Places p
    LEFT JOIN PlaceReviews r ON p.Id = r.PlaceId
    GROUP BY
      p.Id,
      p.Name,
      p.Location,
      p.Description,
      p.ImageUrl
    ORDER BY averageRating DESC, reviewCount DESC
  `);

  return result.recordset;
}

async function getPopularPlacesController(req, res) {
  try {
    const places = await getPopularPlaces();
    res.status(200).json(places);
  } catch (error) {
    console.error("GET POPULAR PLACES ERROR:", error);
    res.status(500).json({ message: "Popular places could not be fetched" });
  }
}

module.exports = {
  addReview,
  getLatestReviews,
  getPopularPlaces: getPopularPlacesController,
};