import { Router } from "express"
import { getStats, listUsers, updateUserRole, listAllEvents } from "../controllers/admin.controller.js"
import { uploadSong, deleteSong } from "../controllers/songs.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.middleware.js"

const router = Router()

router.use(requireAuth)
router.use(requireRole(["ADMIN"]))

router.get("/stats", getStats)
router.get("/users", listUsers)
router.patch("/users/:id", updateUserRole)
router.get("/events", listAllEvents)
router.post("/songs", uploadSong)
router.delete("/songs/:id", deleteSong)

export default router
