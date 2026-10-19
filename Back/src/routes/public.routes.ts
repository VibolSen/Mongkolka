import { Router } from "express"
import { getPublicEvent, submitRsvp, getMessages, postMessage } from "../controllers/public.controller.js"

const router = Router()

// Public invitation SSR data
router.get("/events/:slug", getPublicEvent)

// Public Guest RSVP submission
router.post("/events/:id/rsvp", submitRsvp)

// Public Guestbook wishes
router.get("/events/:id/messages", getMessages)
router.post("/events/:id/messages", postMessage)

export default router
