import * as authService from "../services/auth.service.js";

//Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newUser = await authService.registerUser(name, email, password);

    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Registration failed", error: err.message });
  }
};



//Login user
export const loginUser = async (req, res) => {
  try {

    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const {token, user} = await authService.login(email, password);

    res.json({
      message: "Login successful",
      data: {
        accessToken: token,
      },
      user: user
    });

  } catch (err) {
    res.status(err.status || 500);
    res.json({ message: err.message });
  }
};
