import Customer from "../models/customer.model.js";
import Reservation from "../models/reservation.model.js";
import { formatDateToNepal } from "./helper.utils.js";
export const addLoggedUserAsFutsalCustomer = async (futsal, user) => {
  const customerExists = await loggedUserAlreadyExistsAsCustomer(futsal, user);
  try {
    if (!customerExists) {
      const response = await Customer.create({ futsal, user });
      if (!response) {
        console.log("Could not add customer");
      }
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};

export const addGuestUserAsFutsalCustomer = async (futsal, guestUser) => {
  const { fullName, email, contact } = guestUser;
  const customerExists = await guestUserAlreadyExistsAsCustomer(
    futsal,
    fullName,
    email,
    contact
  );
  try {
    if (!customerExists) {
      const response = await Customer.create({
        futsal,
        guestUser,
      });
      if (!response) {
        console.log("Could not add guest customer");
      }
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};

const loggedUserAlreadyExistsAsCustomer = async (futsal, user) => {
  const response = await Customer.countDocuments({ futsal, user });
  return response > 0;
};

const guestUserAlreadyExistsAsCustomer = async (
  futsal,
  fullName,
  email,
  contact
) => {
  const response = await Customer.countDocuments({
    futsal,
    "guestUser.fullName": fullName,
    "guestUser.email": email,
    "guestUser.contact": contact,
  });
  return response > 0;
};

export const numberOfGamesPlayedByCustomer = async (
  futsal,
  isRegisteredUser,
  user
) => {
  const response = isRegisteredUser
    ? await Reservation.find({ futsal, user }).populate(["futsal", "slot"])
    : await Reservation.find({
        futsal,
        "guestUser.fullName": user.fullName,
        "guestUser.email": user.email,
        "guestUser.contact": user.contact,
      }).populate(["futsal", "slot"]);
  return response;
};

export const lastPlayedDate = async (futsal, isRegisteredUser, user) => {
  const response = isRegisteredUser
    ? await Reservation.findOne({ futsal, user })
    : await Reservation.findOne({
        futsal,
        "guestUser.fullName": user.fullName,
        "guestUser.email": user.email,
        "guestUser.contact": user.contact,
      })
        .sort({ createdAt: -1 })
        .select("-_id createdAt");
  return formatDateToNepal(new Date(response.createdAt));
};
