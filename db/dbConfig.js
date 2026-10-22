const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
