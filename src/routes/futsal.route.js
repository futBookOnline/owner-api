import express from "express";
import {
  getFutsal,
  onboardFutsal,
  updateFutsal,
} from "../controllers/futsal.controller.js";
import { getFutsalByUserId } from "../controllers/futsal.controller.js";

const router = express.Router();

router.get("/:userId/futsal", getFutsalByUserId);
router.get("/:id", getFutsal);
router.put("/:userId/onboard", onboardFutsal);
router.put("/:id", updateFutsal);

export default router;
