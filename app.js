require("dotenv").config();

const express = require("express");
const cors = require("cors");

// fail early if important settings are missing
const required = ["DB_USER", "DB_NAME", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

// db connection (must be loaded after dotenv)
const dbConnection = require("./db/dbConfig");

const userRoutes = require("./routes/userRoute");
const questionsRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Evangadi Forum API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answerRoutes);

// unknown route
app.use((req, res) => {
  res.status(404).json({ msg: "route not found" });
});

// error handler (for example: invalid JSON body)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ msg: "invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ msg: "something went wrong, please try again later" });
});

async function start() {
  try {
    await dbConnection.execute("select 'test'");
    console.log("database connection established");
    app.listen(port, () => console.log(`listening on ${port}`));
  } catch (error) {
    console.error("database connection failed:", error.message);
    process.exit(1);
  }
}

start();
