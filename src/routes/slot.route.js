import express from "express";
import {
  listSlots,
  addDailySlots,
  removeAllSlots,
  updateSlot,
} from "../controllers/slot.controller.js";
const router = express.Router();

router.get("/:venueId", listSlots);
router.post("/generate-daily-slots", addDailySlots);
router.put("/:id", updateSlot);
router.delete("/delete-all", removeAllSlots);
export default router;
