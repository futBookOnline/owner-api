import Slot from "../models/slot.model.js";
import Futsal from "../models/futsal.model.js";
import {
  adjustDateToNepalTimezone,
  isHexadecimalString,
} from "../utils/helper.utils.js";
import { generateSlots } from "../utils/slot.utils.js";

// GET API: Fetch All Slots By Venue And Start Date
export const listSlots = async (req, res) => {
  const { venueId } = req.params;
  const { startDate } = req.query;
  let query = {};
  if (venueId) {
    query = { venueId };
    if (startDate) {
      const queryStartDate = adjustDateToNepalTimezone(startDate);
      query = {
        venueId,
        date: {
          $gte: queryStartDate,
          $lte: queryStartDate,
        },
      };
    }
  }
  try {
    const slots = await Slot.find(query);
    if (slots.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No slots found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Slots fetched successfully",
      data: slots,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching slots",
      error: error.message,
    });
  }
};

// POST API: Generate Slots For a Day
export const addDailySlots = async (req, res) => {
  try {
    const { venueId, date } = req.body; // Example input: { "venueId": "123", "date": "2024-09-24" }
    const isValidObjectId = isHexadecimalString(venueId);
    if (!isValidObjectId) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }
    const venue = await Futsal.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }
    const slots = await generateSlots(venue, new Date(date));
    return res.status(200).json({
      success: true,
      message: "Slots generated successfully",
      data: slots,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "An error occurred while generating slots",
      error: error.message,
    });
  }
};


export const removeAllSlots = async(req, res) =>{
  const response = await Slot.deleteMany({});
  res.json({ response });
}