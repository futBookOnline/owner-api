import Reservation from "../models/reservation.model.js";
import Slot from "../models/slot.model.js";
import { getIoInstance } from "../sockets/socket.handler.js";
import {
  addLoggedUserAsFutsalCustomer,
  addGuestUserAsFutsalCustomer,
} from "../utils/customer.utils.js";
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
  console.log("VENUE ID: ", venueId);
  try {
    let reservations = await Reservation.find({ futsal: venueId }).populate([
      {
        path: "slot",
        select: "date startTime endTime basePrice dynamicPrice isHoliday isWeekend", // Fields to include from the Slot model
      },
      {
        path: "user",
        select: "email contact fullName", // Fields to include from the User model
      },
    ])
    .select("-futsal -createdAt -updatedAt -__v");
    if (reservations.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reservation found",
      });
    }

    reservations = reservations.map((reservation) => ({
      id: reservation._id,
      slot: {
        slotId: reservation.slot._id,
        slotDate: reservation.slot.date,
        slotTime: `${reservation.slot.startTime} - ${reservation.slot.endTime}`,
        isHoliday: reservation.slot.isHoliday || reservation.slot.isWeekend,
        price: reservation.slot.isHoliday || reservation.slot.isWeekend ? reservation.slot.dynamicPrice : reservation.slot.basePrice
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

export const removeAllReservations = async (req, res) => {
  const response = await Reservation.deleteMany({});
  res.json({ response });
};
