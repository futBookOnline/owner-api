import express from "express"
import { changePassword, getUser } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/:id", getUser)
router.put("/:id/change-password", changePassword)

export default router