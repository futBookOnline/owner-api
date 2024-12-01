import express from "express"
import { resetPassword, validateResetPassword } from "../controllers/reset.password.controller.js"

const router = express.Router()
router.post("/reset-password", resetPassword)
router.get("/reset-password", validateResetPassword)

export default router