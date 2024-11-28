import Reservation from "../models/reservation.model.js";
import Slot from "../models/slot.model.js";
import { getIoInstance } from "../sockets/socket.handler.js";
import {
  addLoggedUserAsFutsalCustomer,
  addGuestUserAsFutsalCustomer,
} from "../utils/customer.utils.js";
import {
  adjustDateToNepalTimezone,
  isHexadecimalString,
} from "../utils/helper.utils.js";

//GET API: Get reservation by id
export const getReservation = async (req, res) => {
  const id = req.params.id;
  try {
    const reservation = await Reservation.findById(id).populate([
      {
        path: "slot",
        select:
          "date startTime endTime basePrice dynamicPrice isHoliday isWeekend",
      },
      {
        path: "user",
        select: "fullName email contact",
      },
    ]);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Reservation fetched successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching reservations",
      message: error.message,
    });
  }
};

// POST API: Add new reservation
export const addReservation = async (req, res) => {
  const reservationObject = req.body;
  const isRegisteredUser = reservationObject.user;
  try {
    let reservation = await Reservation.create(reservationObject);
    if (!reservation)
      return res.status(401).json({ message: "Reservation failed" });
    const slot = await Slot.findByIdAndUpdate(
      reservationObject.slot,
      { isReserved: true }, // The field to update
      { new: true }
    );
    reservation = await Reservation.findById(reservation._id).populate([
      "futsal",
      "slot",
    ]);
    isRegisteredUser
      ? addLoggedUserAsFutsalCustomer(
          reservation.futsal._id,
          reservationObject.user
        )
      : addGuestUserAsFutsalCustomer(
          reservation.futsal._id,
          reservationObject.guestUser
        );
    getIoInstance().emit("reservation-added", reservation);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: List all reservation
export const listReservations = async (req, res) => {
  const { venueId } = req.params;
  const { date } = req.query;
  let today = adjustDateToNepalTimezone(date);
  let match = { date: { $gte: today, $lte: today } };
  let populateOptions = [
    {
      path: "slot",
      match: match && Object.keys(match).length ? match : null,
      select:
        "date startTime endTime basePrice dynamicPrice isHoliday isWeekend",
    },
    {
      path: "user",
      select: "email contact fullName",
    },
  ];
  try {
    let reservations = await Reservation.find({ futsal: venueId })
      .populate(populateOptions)
      .select("-futsal -createdAt -updatedAt -__v");
    if (reservations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reservation found",
      });
    }
    if (date) {
      reservations = reservations.filter(
        (reservation) => reservation.slot !== null
      );
    }
    reservations = reservations.map((reservation) => ({
      id: reservation._id,
      slot: {
        slotId: reservation.slot._id,
        slotDate: reservation.slot.date,
        slotTime: `${reservation.slot.startTime} - ${reservation.slot.endTime}`,
        isHoliday: reservation.slot.isHoliday || reservation.slot.isWeekend,
        price:
          reservation.slot.isHoliday || reservation.slot.isWeekend
            ? reservation.slot.dynamicPrice
            : reservation.slot.basePrice,
      },
      customer: reservation.user || reservation.guestUser,
    }));
    res.status(200).json({
      success: true,
      message: "Reservations fetched successfully",
      data: reservations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching reservations",
      error: error.message,
    });
  }
};

// DELETE API: Remove reservation
export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  const isValidObjectId = isHexadecimalString(id);
  if (!isValidObjectId) {
    return res.status(404).json({
      success: false,
      message: "Reservation not found",
    });
  }
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(id)
    // const deletedReservation = await Reservation.findById(id);

    if (!deletedReservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }
    const { slot } = deletedReservation;
    const updatedSlot = await Slot.findByIdAndUpdate(
      slot,
      { isReserved: false },
      { new: true }
    );
    if (!updatedSlot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: slot,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while cancelling reservation",
      error: error.message,
    });
  }
};

export const removeAllReservations = async (req, res) => {
  const response = await Reservation.deleteMany({});
  res.json({ response });
};
