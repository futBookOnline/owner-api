import Futsal from "../models/futsal.model.js";

// GET API: Fetch One Futsal By Id
export const getFutsal = async (req, res) => {
  const id = req.params.id;
  try {
    let futsal = await Futsal.findById(id)
      .select("-createdAt -updatedAt -__v")
      .populate("userId", "email isOnboarded isActive");
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
      .populate("userId", "email isOnboarded isActive");
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
      address: futsal.address,
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
      .populate("userId", "email isOnboarded isActive");
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
      email: updateFutsal.userId.email,
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
      ownerId: updateFutsal.userId._id,
      isFutsalActive: updateFutsal.userId.isActive,
      isFutsalOnboarded: updateFutsal.userId.isOnboarded,
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
