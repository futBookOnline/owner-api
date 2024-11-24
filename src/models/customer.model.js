import mongoose from "mongoose";
import pkg from "validator";
import FutsalUser from "./futsal.user.model.js";
const { isEmail } = pkg;
const futsalCustomerSchema = mongoose.Schema(
  {
    futsal: { type: mongoose.Schema.Types.ObjectId, ref: "FutsalVenue" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "FutsalUser" },
    guestUser: {
      fullName: {
        type: String,
      },
      contact: {
        type: Number,
      },
      email: {
        type: String,
        lowercase: true,
        validate: [isEmail, "Please enter valid email."],
      },
    },
  },
  {
    timestamps: true,
  }
);
const Customer = mongoose.model("FutsalCustomer", futsalCustomerSchema);
export default Customer;
