import crypto from "crypto";
import User from "../models/user.model.js";
import ResetPassword from "../models/reset.password.model.js";

// POST API: Reset Password
export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select(
      "-password -createdAt -updatedAt -__v"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let token = crypto.randomBytes(32).toString("hex");
    console.log("CREATED TOKEN: ", token.length);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("CREATED HASH TOKEN: ", hashedToken);
    await ResetPassword.create({
      user: user._id,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 3600000, // 1 hour
    });
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password?token=${encodeURIComponent(token)}`;
    //PERFORM EMAIL SEND
    res.status(200).json({
      success: true,
      message: "Password reset link successfully",
      data: resetUrl,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching user",
      error: error.message,
    });
  }
};

export const validateResetPassword = async (req, res) => {
  try {
    let { token } = req.query;
    console.log("FETCHED TOKEN: ", token.length);
    token = decodeURIComponent(token.trim());
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("FETCHED DECODED TOKEN: ", token);
    console.log("FETCHED HASH TOKEN: ", hashedToken);
    const resetPassword = await ResetPassword.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!resetPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      userId: resetPassword.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while resetting password",
      error: error.message,
    });
  }
};
