import express from "express"
import { listReservations, addReservation, removeAllReservations } from "../controllers/reservation.controller.js"

const router = express.Router()
router.delete("/delete-all", removeAllReservations)
router.post("/", addReservation)
router.get("/:venueId", listReservations)


export default router