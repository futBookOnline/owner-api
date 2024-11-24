import pkg from "validator";
import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/auth.utils.js";
const { isEmail } = pkg;

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter valid email."],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [8, "Password must be atleast 8 characters long."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    lastLoggedIn: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// Login Static Method
userSchema.statics.login = async function (email, password) {
  if (!email) throw Error("Email cannot be empty");
  if (!password) throw Error("Password cannot be empty");
  const user = await this.findOne({ email });
  if (!user) throw Error("Email does not exist");
  if (!user.isActive) throw Error("Email is inactive");
  const checkPassword = await comparePassword(password, user.password);
  if (!checkPassword) throw Error("Invalid login credentials");
  return user;
};

// hash a password before doc is saved to db
userSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

const User = mongoose.model("FutsalOwner", userSchema);
export default User;
