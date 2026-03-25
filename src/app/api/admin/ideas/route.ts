import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { IdeaStatus, Prisma } from "@/generated/prisma/client"

function requireAdmin(role: string | undefined): boolean {
  return role === "ADMIN"
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // @ts-expect-error - augmented session type
    if (!requireAdmin(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
    )
    const skip = (page - 1) * limit

    // Admins can filter by status; default to PENDING for the approval queue
    const statusParam = searchParams.get("status") ?? IdeaStatus.PENDING
    const status = Object.values(IdeaStatus).includes(statusParam as IdeaStatus)
      ? (statusParam as IdeaStatus)
      : IdeaStatus.PENDING

    const where: Prisma.IdeaWhereInput = { status }

    const [ideas, total] = await Promise.all([
      db.idea.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              nickname: true,
              email: true,
              image: true,
              role: true,
            },
          },
          _count: { select: { votes: true, reports: true } },
        },
      }),
      db.idea.count({ where }),
    ])

    return NextResponse.json({
      ideas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("[GET /api/admin/ideas]", error)
    return NextResponse.json(
      { error: "Failed to fetch ideas for review" },
      { status: 500 }
    )
  }
}
