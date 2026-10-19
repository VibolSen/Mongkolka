import { Router } from "express"
import { listTemplates } from "../controllers/templates.controller.js"

const router = Router()

// Public listing of templates for event wizard and gallery
router.get("/", listTemplates)

export default router
