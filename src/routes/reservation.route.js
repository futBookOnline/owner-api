import express from "express";
import {
  getReservation,
  listReservations,
  addReservation,
  removeAllReservations,
  deleteReservation,
} from "../controllers/reservation.controller.js";

const router = express.Router();
router.delete("/delete-all", removeAllReservations);
router.delete("/:id", deleteReservation)
router.post("/", addReservation);
router.get("/:venueId/venue", listReservations);
router.get("/:id", getReservation);

export default router;
