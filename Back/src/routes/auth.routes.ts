import { Router } from "express"
import { register, login, getMe, updateProfile } from "../controllers/auth.controller.js"
import { requireAuth } from "../middleware/auth.middleware.js"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", requireAuth, getMe)
router.patch("/me", requireAuth, updateProfile)

export default router
