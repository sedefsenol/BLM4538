const express = require("express");
const router = express.Router();
const { pool, poolConnect, sql } = require("../db");

router.get("/:id", async (req, res) => {
  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .query(`
        SELECT Id, FullName
        FROM Users
        WHERE Id = @Id
      `);

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı getirilemedi" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await poolConnect;

    const { fullName } = req.body;

    await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .input("FullName", sql.NVarChar, fullName)
      .query(`
        UPDATE Users
        SET FullName = @FullName
        WHERE Id = @Id
      `);

    res.status(200).json({ message: "Profil güncellendi" });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: "Profil güncellenemedi" });
  }
});

module.exports = router;