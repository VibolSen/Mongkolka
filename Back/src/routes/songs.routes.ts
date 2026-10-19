import { Router } from "express"
import { listSongs } from "../controllers/songs.controller.js"

const router = Router()

// Public listing of songs for wedding templates
router.get("/", listSongs)

export default router
