import express from "express";
import { listCustomers, getCustomerHistory, deleteCustomer } from "../controllers/customer.controller.js";
const router = express.Router();

router.get("/history/:venueId", getCustomerHistory)
router.delete("/:id", deleteCustomer)
router.get("/:venueId", listCustomers);

export default router;
