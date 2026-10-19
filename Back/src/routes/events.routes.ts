import { Router } from "express"
import {
  listEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  getTables,
  createTable,
  authorizeStaff,
} from "../controllers/events.controller.js"
import { requireAuth, requireRole } from "../middleware/auth.middleware.js"

const router = Router()

// All event management routes require authentication and USER or ADMIN role
router.use(requireAuth)
router.use(requireRole(["USER", "ADMIN"]))

router.get("/", listEvents)
router.post("/", createEvent)
router.get("/:id", getEventById)
router.patch("/:id", updateEvent)
router.delete("/:id", deleteEvent)

// Guests
router.get("/:id/guests", getGuests)
router.post("/:id/guests", addGuest)
router.patch("/:id/guests/:guestId", updateGuest)
router.delete("/:id/guests/:guestId", deleteGuest)

// Tables
router.get("/:id/tables", getTables)
router.post("/:id/tables", createTable)

// Staff Authorization
router.post("/:id/staff", authorizeStaff)

export default router
