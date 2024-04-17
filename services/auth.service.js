import bcrypt from "bcrypt";
import User from "../database/schema/user.schema.js";
import CONFIG from "../config/config.js";
import Jwt from "jsonwebtoken";
import { ErrorWithStatus } from "../exceptions/error-with-status.exception.js";

export const registerUser = async (firstname, lastname, email, password) => {
  // Check if email exists
  const user = await User.findOne({ email });
  if (user) {
    throw new ErrorWithStatus("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  return await newUser.save();
};

export const login = async (email, password) => {
  // Check if email exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorWithStatus("User not found", 404);
  }
  // Check if password is not correct
  if (!bcrypt.compareSync(password, user.password)) {
    throw new ErrorWithStatus("Username or Password is incorrect", 401);
  }
  // Generate access token
  const JWT_SECRET = CONFIG.JWT_SECRET;
  const token = Jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },

    JWT_SECRET,
    { expiresIn: "1hr" }
  );

  return { token, user };
};
