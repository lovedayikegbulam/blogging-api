import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import CONFIG from "./config/config.js";
import connectToDb from "./database/connection.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/posts.route.js";
import data from "./base.route.guide.js";
import logger from "./logger/logger.winston.js";
import redis from './integrations/redis.js';

const app = express();
const PORT = CONFIG.PORT || 3000;

// Allow requests from my domain
const whitelist = ["https://blogging-api-ur0o.onrender.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// Handle the base route
app.get("", (req, res) => {
  res.status(200);
  res.json(data);
});

// catch all route
app.all("*", (req, res) => {
  res.status(404);
  res.json({
    message: "Page Not found",
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Connect to databases
  connectToDb();
  redis.connect();

  // Start the server
  app.listen(PORT, () => {
    logger.info(`Server running at http://${CONFIG.LOCAL_HOST}:${PORT}/`);
  });
}

export default app;
