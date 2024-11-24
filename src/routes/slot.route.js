import express from "express"
import { listSlots, addDailySlots, removeAllSlots } from "../controllers/slot.controller.js"
const router = express.Router()

router.get("/:venueId", listSlots)
router.post("/generate-daily-slots", addDailySlots)
router.delete("/delete-all", removeAllSlots)
export default router