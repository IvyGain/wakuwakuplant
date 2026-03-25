import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { IdeaCategory, IdeaStatus } from "@/generated/prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = request.nextUrl

    const category = searchParams.get("category") ?? ""
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    )

    const where: { status: IdeaStatus; category?: IdeaCategory } = {
      status: IdeaStatus.PUBLISHED,
    }

    if (
      category &&
      Object.values(IdeaCategory).includes(category as IdeaCategory)
    ) {
      where.category = category as IdeaCategory
    }

    const ideas = await db.idea.findMany({
      where,
      orderBy: { voteCount: "desc" },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nickname: true,
            image: true,
            role: true,
          },
        },
        votes: session?.user?.id
          ? { where: { userId: session.user.id }, select: { id: true } }
          : false,
      },
    })

    const ranked = ideas.map((idea, index) => {
      const { votes, ...rest } = idea
      return {
        rank: index + 1,
        ...rest,
        hasVoted: Array.isArray(votes) && votes.length > 0,
      }
    })

    return NextResponse.json({ ranking: ranked })
  } catch (error) {
    console.error("[GET /api/ranking]", error)
    return NextResponse.json(
      { error: "Failed to fetch ranking" },
      { status: 500 }
    )
  }
}
