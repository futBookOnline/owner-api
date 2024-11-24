import mongoose from "mongoose";

const futsalHolidaySchema = mongoose.Schema(
  {
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "FutsalVenue" },
    date: {
      type: String,
      required: true,
      unique: true, // Ensure no duplicate holidays for the same date
    },
    name: {
      type: String, // Name of the holiday, e.g., 'Christmas', 'New Year's Day'
    },
    description: {
      type: String, // Optional description of the holiday
    },
  },
  { timestamps: true }
);

const Holiday = mongoose.model("Holiday", futsalHolidaySchema);
export default Holiday;
