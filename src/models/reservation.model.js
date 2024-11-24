import mongoose from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;

const reservationSchema = mongoose.Schema(
  {
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
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
  { timestamps: true}
);

const Reservation = mongoose.model("FutsalReservation", reservationSchema);

export default Reservation;
