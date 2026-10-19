import { Router } from "express"
import {
  getStats,
  listUsers,
  updateUserRole,
  deleteUser,
  listAllEvents,
  deleteEvent,
  togglePublishEvent,
} from "../controllers/admin.controller.js"
import {
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templates.controller.js"
import { uploadSong, deleteSong } from "../controllers/songs.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.middleware.js"

const router = Router()

router.use(requireAuth)
router.use(requireRole(["ADMIN"]))

// Stats
router.get("/stats", getStats)

// Users Management
router.get("/users", listUsers)
router.patch("/users/:id", updateUserRole)
router.delete("/users/:id", deleteUser)

// Events Monitoring & Moderation
router.get("/events", listAllEvents)
router.patch("/events/:id/publish", togglePublishEvent)
router.delete("/events/:id", deleteEvent)

// Templates Management
router.get("/templates", listTemplates)
router.post("/templates", createTemplate)
router.patch("/templates/:id", updateTemplate)
router.delete("/templates/:id", deleteTemplate)

// Songs Management
router.post("/songs", uploadSong)
router.delete("/songs/:id", deleteSong)

export default router
