import Customer from "../models/customer.model.js";
import {
  numberOfGamesPlayedByCustomer,
  lastPlayedDate,
} from "../utils/customer.utils.js";
import { isHexadecimalString } from "../utils/helper.utils.js";
// GET API: List All Customers
export const listCustomers = async (req, res) => {
  const { venueId } = req.params;
  try {
    let customers = await Customer.find({ futsal: venueId }).populate(
      "user",
      "email fullName contact" // Select specific fields for userId
    );
    if (customers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No customers found",
      });
    }
    customers = await Promise.all(
      customers.map(async (customer) => {
        let id = customer._id;
        let gamesPlayed = customer.user
          ? await numberOfGamesPlayedByCustomer(venueId, true, customer.user)
          : await numberOfGamesPlayedByCustomer(
              venueId,
              false,
              customer.guestUser
            );
        let lastPlayed = customer.user
          ? await lastPlayedDate(venueId, true, customer.user)
          : await lastPlayedDate(venueId, false, customer.guestUser);
        let fullName = customer.user
          ? customer.user.fullName
          : customer.guestUser.fullName;
        let email = customer.user
          ? customer.user.email
          : customer.guestUser.email;
        let contact = customer.user
          ? customer.user.contact
          : customer.guestUser.contact;
        let isRegistered = customer.user !== undefined;
        let user = customer.user;
        return {
          id,
          gamesPlayed: gamesPlayed.length,
          lastPlayed,
          fullName,
          email,
          contact,
          isRegistered,
          user,
        };
      })
    );
    res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching customers",
      error: error.message,
    });
  }
};

// GET API: Fetch Customer History
export const getCustomerHistory = async (req, res) => {
  const { venueId } = req.params;
  let { isRegistered, user } = req.query;
  isRegistered = isRegistered === "true";
  user = JSON.parse(user);
  user = isRegistered ? user._id : user;
  try {
    let customerHistories = await numberOfGamesPlayedByCustomer(
      venueId,
      isRegistered,
      user
    );
    if (customerHistories.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No customer history found",
      });
    }
    customerHistories = customerHistories.map((customerHistory) => ({
      reservationId: customerHistory._id,
      date: customerHistory.slot.date,
      time: `${customerHistory.slot.startTime} - ${customerHistory.slot.endTime}`,
      isHoliday:
        customerHistory.slot.isHoliday || customerHistory.slot.isWeekend,
      price:
        customerHistory.slot.isHoliday || customerHistory.slot.isWeekend
          ? customerHistory.slot.basePrice
          : customerHistory.slot.dynamicPrice,
    }));
    //date time price isholiday
    return res.status(200).json({
      success: true,
      message: "Customer histories fetched successfully",
      data: customerHistories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching customer history",
      error: error.message,
    });
  }
};

// DELETE API: Remove Customer
export const deleteCustomer = async (req, res) => {
  let { id } = req.params;
  const isValidObjectId = isHexadecimalString(id);
    if (!isValidObjectId) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({
        success: true,
        message: "Customer not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while removing customer",
      error: error.message,
    });
  }
};
