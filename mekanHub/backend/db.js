const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const connectionString =
  "Driver={ODBC Driver 17 for SQL Server};" +
  `Server=${process.env.DB_SERVER};` +
  `Database=${process.env.DB_NAME};` +
  "Trusted_Connection=Yes;" +
  "Encrypt=No;" +
  "TrustServerCertificate=Yes;" +
  "Connection Timeout=5;";

const config = {
  connectionString,
  driver: "msnodesqlv8",
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
  sql,
  pool,
  poolConnect,
};