import User from "../models/user.model.js";
import { createToken } from "../utils/auth.utils.js";

// POST API: Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const id = user._id;
    const token = createToken(id);
    const updateLastLoggedIn = await User.findByIdAndUpdate(
      id,
      { lastLoggedIn: new Date().toString() },
      { new: true }
    );
    const { password: hashedPassword, ...rest } = updateLastLoggedIn._doc;
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      data: rest,
    });
  } catch (error) {
    if (error.id) {
      // Handle specific errors with user id
      res
        .status(400)
        .json({ success: false, data: error.id, message: error.message });
    } else {
      res.status(400).json({
        success: false,
        message: "An error occurred while logging in",
        error: error.message,
      });
    }
  }
};
