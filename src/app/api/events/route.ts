import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { EventStatus } from "@/generated/prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const status = searchParams.get("status") ?? ""
    const upcoming = searchParams.get("upcoming") === "true"

    const where: {
      status?: EventStatus
      eventDate?: { gte: Date }
    } = {}

    if (
      status &&
      Object.values(EventStatus).includes(status as EventStatus)
    ) {
      where.status = status as EventStatus
    }

    // Optionally filter to future events only
    if (upcoming) {
      where.eventDate = { gte: new Date() }
    }

    const events = await db.event.findMany({
      where,
      orderBy: { eventDate: "asc" },
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error("[GET /api/events]", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
