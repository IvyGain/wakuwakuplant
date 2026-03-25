import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { IdeaCategory, IdeaStatus, Prisma } from "@/generated/prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = request.nextUrl

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10))
    )
    const category = searchParams.get("category") ?? ""
    const sort = searchParams.get("sort") ?? "latest"
    const search = searchParams.get("search") ?? ""
    const skip = (page - 1) * limit

    const isAdmin =
      session?.user &&
      // @ts-expect-error - augmented session type
      (session.user.role === "ADMIN")

    // Build where clause
    const where: Prisma.IdeaWhereInput = {}

    // Non-admins only see PUBLISHED ideas
    if (!isAdmin) {
      where.status = IdeaStatus.PUBLISHED
    }

    if (category && Object.values(IdeaCategory).includes(category as IdeaCategory)) {
      where.category = category as IdeaCategory
    }

    if (search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Build orderBy
    const orderBy: Prisma.IdeaOrderByWithRelationInput =
      sort === "popular"
        ? { voteCount: "desc" }
        : { createdAt: "desc" }

    const [ideas, total] = await Promise.all([
      db.idea.findMany({
        where,
        orderBy,
        skip,
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
          _count: { select: { votes: true } },
        },
      }),
      db.idea.count({ where }),
    ])

    const ideasWithVoteStatus = ideas.map((idea) => {
      const { votes, ...rest } = idea
      return {
        ...rest,
        hasVoted: Array.isArray(votes) && votes.length > 0,
      }
    })

    return NextResponse.json({
      ideas: ideasWithVoteStatus,
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
    console.error("[GET /api/ideas]", error)
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, images } = body

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      )
    }

    if (
      !category ||
      !Object.values(IdeaCategory).includes(category as IdeaCategory)
    ) {
      return NextResponse.json(
        { error: `Category must be one of: ${Object.values(IdeaCategory).join(", ")}` },
        { status: 400 }
      )
    }

    const idea = await db.idea.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category as IdeaCategory,
        authorId: session.user.id,
        status: IdeaStatus.PENDING,
        images: Array.isArray(images) ? images.filter((i: unknown) => typeof i === "string") : [],
      },
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
      },
    })

    return NextResponse.json({ idea }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/ideas]", error)
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    )
  }
}
