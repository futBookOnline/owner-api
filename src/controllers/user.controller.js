import User from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/auth.utils.js";
// Handle Errors
export const handleErrors = (err) => {
    let errors = { email: "", password: "" };
    if (err.code === 11000) {
      errors.email = "This email is already registered.";
      return errors;
    }
    if (err.message.includes("User validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
  };
  
  // GET API: Fetch All Users
  export const listUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password");
      if (users.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No users found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "An error occurred while fetching users",
        error: error.message,
      });
    }
  };

  // GET API: Fetch User By Id
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findById(id).select("-password");
      user
        ? res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
          })
        : res.status(404).json({
            success: false,
            message: "User Not Found",
          });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "An error occurred while fetching users",
        message: error.message,
      });
    }
  };

  // POST API: Change Password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: !oldPassword
        ? "Old password cannot be empty"
        : "New password cannot be empty",
    });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const checkOldPassword = await comparePassword(oldPassword, user.password);
    if (!checkOldPassword)
      return res.status(401).json({
        success: false,
        message: "Wrong old password",
      });
    const checkNewPassword = await comparePassword(newPassword, user.password);
    if (checkNewPassword)
      return res.status(401).json({
        success: false,
        message: "New password and old password cannot be same",
      });
    const hashedPassword = await hashPassword(newPassword);
    const updatePassword = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatePassword) {
      return res.status(400).json({
        success: false,
        message: "Password update failed",
      });
    }
    const { password: hashedPass, ...rest } = updatePassword._doc;
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: rest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while updating password",
      error: error.message,
    });
  }
};