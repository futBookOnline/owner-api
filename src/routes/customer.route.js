import express from "express";
import { listCustomers, getCustomerHistory } from "../controllers/customer.controller.js";
const router = express.Router();

router.get("/history/:venueId", getCustomerHistory)
router.get("/:venueId", listCustomers);

export default router;
