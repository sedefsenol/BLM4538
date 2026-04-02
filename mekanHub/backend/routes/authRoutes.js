const express = require("express");
const bcrypt = require("bcrypt");
const { poolConnect, pool, sql } = require("../db");

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    console.log("REGISTER BODY:", req.body);

    fullName = fullName?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Tüm alanlar zorunludur",
      });
    }

    await poolConnect;
    console.log("SQL BAGLANTISI TAMAM");

    const existingUser = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @Email");

    console.log("EMAIL KONTROL:", existingUser.recordset);

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({
        message: "Bu e-posta zaten kayıtlı",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("HASH OK");

    const insertResult = await pool
      .request()
      .input("FullName", sql.NVarChar, fullName)
      .input("Email", sql.NVarChar, email)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .query(`
        INSERT INTO Users (FullName, Email, PasswordHash)
        VALUES (@FullName, @Email, @PasswordHash)
      `);

    console.log("INSERT OK:", insertResult);

    res.status(201).json({
      message: "Kayıt başarılı",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: error.message || "Sunucu hatası",
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    let { fullName, password } = req.body;

    fullName = fullName?.trim();
    password = password?.trim();

    if (!fullName || !password) {
      return res.status(400).json({
        message: "İsim ve şifre zorunludur",
      });
    }

    await poolConnect;

    const result = await pool
      .request()
      .input("FullName", sql.NVarChar, fullName)
      .query("SELECT * FROM Users WHERE FullName = @FullName");

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Şifre yanlış",
      });
    }

    res.json({
      message: "Giriş başarılı",
      user: {
        id: user.Id,
        fullName: user.FullName,
        email: user.Email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Sunucu hatası",
    });
  }
});

module.exports = router;