import * as authService from "../services/auth.service.js";
import logger from "../logger/logger.winston.js"; // Import the Winston logger

// Register user
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      logger.error("Passwords do not match");
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newUser = await authService.registerUser(firstname, lastname, email, password);
    logger.info("User registered successfully");

    res.status(201).json({ message: "User registered successfully", data: newUser });
  } catch (err) {
    logger.error(`Registration failed: ${err.message}`);
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.login(email, password);
    logger.info("Login successful");

    res.json({
      message: "Login successful",
      data: {
        accessToken: token,
      },
      user: user
    });
  } catch (err) {
    logger.error(`Login failed: ${err.message}`);
    res.status(err.status || 500).json({ message: err.message });
  }
};
