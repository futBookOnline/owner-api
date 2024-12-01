import express from "express"
import { changePassword, getUser, resetPassword } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/:id", getUser)
router.put("/:id/change-password", changePassword)
router.post("/:id/reset-password", resetPassword)

export default router