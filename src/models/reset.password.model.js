import mongoose from "mongoose";
const resetPasswordSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resetPasswordToken: { type: String, required: true },
    resetPasswordExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

resetPasswordSchema.index(
  { resetPasswordExpires: 1 },
  { expireAfterSeconds: 0 }
);
const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);
export default ResetPassword;
