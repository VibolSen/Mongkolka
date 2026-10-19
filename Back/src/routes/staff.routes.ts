import { Router } from "express"
import { listStaffEvents, scanCheckIn, guestLookup } from "../controllers/staff.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.middleware.js"

const router = Router()

router.use(requireAuth)
router.use(requireRole(["STAFF", "ADMIN"]))

router.get("/events", listStaffEvents)
router.post("/scan", scanCheckIn)
router.get("/lookup", guestLookup)

export default router
