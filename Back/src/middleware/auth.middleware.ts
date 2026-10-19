import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: "USER" | "ADMIN" | "STAFF"
    name?: string | null
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "mongkolka_jwt_secret_key_change_in_production"

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required. Missing token." })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: any }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    })

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid session. User not found." })
    }

    req.user = user
    next()
  } catch (error: any) {
    return res.status(401).json({ success: false, message: "Invalid or expired token", error: error.message })
  }
}

export function requireRole(allowedRoles: Array<"USER" | "ADMIN" | "STAFF">) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    // ADMIN has full platform privileges across all USER routes
    if (req.user.role === "ADMIN") {
      return next()
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' does not have permission for this resource.`,
      })
    }

    next()
  }
}
