import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

import authRoutes from "./routes/auth.routes.js"
import eventRoutes from "./routes/events.routes.js"
import publicRoutes from "./routes/public.routes.js"
import staffRoutes from "./routes/staff.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import songRoutes from "./routes/songs.routes.js"
import templateRoutes from "./routes/templates.routes.js"
import { handleUpload } from "./controllers/upload.controller.js"
import { requireAuth } from "./middleware/auth.middleware.js"

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json({ limit: "25mb" }))
app.use(express.urlencoded({ extended: true, limit: "25mb" }))

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Mongkolka API", timestamp: new Date().toISOString() })
})

// Route Mounting
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/public", publicRoutes)
app.use("/api/staff", staffRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/songs", songRoutes)
app.use("/api/templates", templateRoutes)
app.post("/api/upload", requireAuth, handleUpload)

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled API error:", err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Mongkolka Backend REST API running on http://localhost:${PORT}`)
})

export default app
