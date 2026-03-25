import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Role } from "@/generated/prisma/client"

/**
 * Hash a password before storing it.
 *
 * TODO: Replace this stub with a real bcrypt hash once bcryptjs is installed:
 *   npm install bcryptjs @types/bcryptjs
 *   import bcrypt from "bcryptjs"
 *   return bcrypt.hash(password, 12)
 *
 * WARNING: The current implementation stores the password in plain text.
 * This is intentionally limited to MVP demo purposes only and MUST be
 * replaced before any real user data is handled.
 */
async function hashPassword(password: string): Promise<string> {
  // TODO: replace with bcrypt.hash(password, 12)
  return password
}

const VALID_ROLES = Object.values(Role)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, nickname, role: rawRole } = body

    // --- Validation ---
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Resolve role — default to GENERAL if not supplied or unrecognised
    const role: Role =
      typeof rawRole === "string" && VALID_ROLES.includes(rawRole as Role)
        ? (rawRole as Role)
        : Role.GENERAL

    // --- Duplicate check ---
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // --- Create user ---
    const hashedPassword = await hashPassword(password)

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: typeof name === "string" ? name.trim() || null : null,
        nickname: typeof nickname === "string" ? nickname.trim() || null : null,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/auth/register]", error)
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
