import Futsal from "../models/futsal.model.js";
import User from "../models/user.model.js";
import { isHexadecimalString } from "../utils/helper.utils.js";

// GET API: Fetch One Futsal By Id
export const getFutsal = async (req, res) => {
  const id = req.params.id;
  try {
    let futsal = await Futsal.findById(id)
      .select("-createdAt -updatedAt -__v")
      .populate("user", "email isOnboarded isActive");
    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }
    futsal = {
      id: futsal._id,
      futsalName: futsal.name,
      contact: futsal.contact,
      email: futsal.userId.email,
      address: `${futsal.address.street}, ${futsal.address.district}`,
      longitude: futsal.location.coordinates && futsal.location.coordinates[0],
      latitude: futsal.location.coordinates && futsal.location.coordinates[1],
      imageUrl: futsal.imageUrl,
      opensAt: futsal.opensAt,
      closesAt: futsal.closesAt,
      ownerId: futsal.userId._id,
      isFutsalActive: futsal.userId.isActive,
      isFutsalOnboarded: futsal.userId.isOnboarded,
    };
    res.status(200).json({
      success: true,
      message: "Futsal fetched successfully",
      data: futsal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching futsals",
      error: error.message,
    });
  }
};

// GET API: Fetch One Futsal By User Id
export const getFutsalByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    let futsal = await Futsal.findOne(userId)
      .select("-createdAt -updatedAt -__v")
      .populate("user", "email isOnboarded isActive");
    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }
    futsal = {
      id: futsal._id,
      futsalName: futsal.name,
      contact: futsal.contact,
      email: futsal.user.email,
      address: futsal.address,
      longitude: futsal.location.coordinates && futsal.location.coordinates[0],
      latitude: futsal.location.coordinates && futsal.location.coordinates[1],
      imageUrl: futsal.imageUrl,
      opensAt: futsal.opensAt,
      closesAt: futsal.closesAt,
      ownerId: futsal.user._id,
      isFutsalActive: futsal.user.isActive,
      isFutsalOnboarded: futsal.user.isOnboarded,
    };
    res.status(200).json({
      success: true,
      message: "Futsal fetched successfully",
      data: futsal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while fetching futsals",
      error: error.message,
    });
  }
};

// PUT API: Update Futsal Info
export const updateFutsal = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  try {
    let updateFutsal = await Futsal.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    )
      .select("-createdAt -updatedAt -__v")
      .populate("user", "email isOnboarded isActive");
    if (!updateFutsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }
    updateFutsal = {
      id: updateFutsal._id,
      futsalName: updateFutsal.name,
      contact: updateFutsal.contact,
      email: updateFutsal.user.email,
      address: updateFutsal.address,
      longitude:
        updateFutsal.location.coordinates &&
        updateFutsal.location.coordinates[0],
      latitude:
        updateFutsal.location.coordinates &&
        updateFutsal.location.coordinates[1],
      imageUrl: updateFutsal.imageUrl,
      opensAt: updateFutsal.opensAt,
      closesAt: updateFutsal.closesAt,
      ownerId: updateFutsal.user._id,
      isFutsalActive: updateFutsal.user.isActive,
      isFutsalOnboarded: updateFutsal.user.isOnboarded,
    };
    res.status(200).json({
      success: true,
      message: "Futsal info updated successfully",
      data: updateFutsal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while updating futsal",
      error: error.message,
    });
  }
};

//PUT API: Onboard Futsal
export const onboardFutsal = async (req, res) => {
  const { userId } = req.params;
  console.log("USER ID: ", userId);
  const onboardFields = req.body;
  console.log("FIELDS TO ONBOARD: ", onboardFields);
  const isValidObject = isHexadecimalString(userId);
  if (!isValidObject) {
    return res.status(404).json({
      success: false,
      message: "Futsal not found",
    });
  }
  try {
    let updateFutsal = await Futsal.findOneAndUpdate(
      { user: userId },
      { $set: onboardFields },
      { new: true }
    );
    console.log("POST ONBOARD: ", updateFutsal);
    if (!updateFutsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }
    // const userId = updateFutsal.user;
    const updateOnboardStatus = await User.findByIdAndUpdate(
      userId,
      { isOnboarded: true },
      { new: true }
    ).select("-password -createdAt -updatedAt -__v");
    console.log("POST ONBOARD STATUS CHANGE: ", updateOnboardStatus);

    if (!updateOnboardStatus) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Futsal onboarded successfully",
      data: updateOnboardStatus,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while onboarding futsal",
      error: error.message,
    });
  }
};
