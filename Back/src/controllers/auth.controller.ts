import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import { AuthRequest } from "../middleware/auth.middleware.js"

const JWT_SECRET = process.env.JWT_SECRET || "mongkolka_jwt_secret_key_change_in_production"

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userRole = role === "ADMIN" ? "ADMIN" : role === "STAFF" ? "STAFF" : "USER"

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "30d",
    })

    return res.status(201).json({
      success: true,
      data: { user, token },
      message: "Account created successfully",
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Registration failed", error: error.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "30d",
    })

    const userDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    return res.json({
      success: true,
      data: { user: userDto, token },
      message: "Login successful",
    })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Login failed", error: error.message })
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  return res.json({
    success: true,
    data: req.user,
  })
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name } = req.body
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" })

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name: name || undefined },
      select: { id: true, name: true, email: true, role: true },
    })

    return res.json({ success: true, data: updated, message: "Profile updated" })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Update failed", error: error.message })
  }
}
