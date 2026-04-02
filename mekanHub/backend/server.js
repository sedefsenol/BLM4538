const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("MekanHub backend çalışıyor");
});

app.listen(5000, () => {
  console.log("Server 5000 portunda çalışıyor");
});