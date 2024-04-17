import mongoose from "mongoose";
import CONFIG from "../config/config.js";

const connectToDb = async () => {
  const MONGODB_URI = CONFIG.MONGODB_URI;

  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connection to DB successful');
    } catch (error) {
      console.error('Connection to DB failed');
      console.error(error);
    }
  } else {
    console.error('MongoDB URI is not provided');
  }

  // Add event listeners
  mongoose.connection.on('connected', () => {
    console.log('Connection to DB successful');
  });

  mongoose.connection.on("error", (err) => {
    console.error('Connection to DB failed');
    console.error(err);
  });
};

export default connectToDb;
