import express from "express";
import cors from "cors";
import CONFIG from "./config/config.js";
import connectToDb from "./database/connection.js";

const app = express();
const PORT = CONFIG.PORT || 3000;

// Connect to Mongodb Database
connectToDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes


app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// catch all route
app.all("*", (req, res) => {
    res.status(404);
    res.json({
      message: "Not found",
    });
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://${CONFIG.LOCAL_HOST}:${CONFIG.PORT}/`);
  });