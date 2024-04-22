import express from "express";
import cors from "cors";
import CONFIG from "./config/config.js";
import connectToDb from "./database/connection.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/posts.route.js";
import data from "./base.route.guide.js";


const app = express();
const PORT = CONFIG.PORT || 3000;

// Connect to Mongodb Database
connectToDb();

// Allow requests from my domain
const whitelist = ['https://blogging-api-ur0o.onrender.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
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
  res.status(404);
  res.json(data);
});

// catch all route
app.all("*", (req, res) => {
    res.status(404);
    res.json({
      message: "Page Not found",
    });
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://${CONFIG.LOCAL_HOST}:${CONFIG.PORT}/`);
  });