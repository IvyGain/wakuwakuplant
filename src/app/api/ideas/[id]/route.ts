import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { IdeaCategory, IdeaStatus } from "@/generated/prisma/client"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    const idea = await db.idea.findUnique({
      where: { id },
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
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    // Non-admins can only view published ideas (or their own)
    const isAdmin =
      // @ts-expect-error - augmented session type
      session?.user?.role === "ADMIN"
    const isAuthor = session?.user?.id === idea.authorId
    const isPublished = idea.status === IdeaStatus.PUBLISHED

    if (!isPublished && !isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    const { votes, ...rest } = idea
    const ideaWithVoteStatus = {
      ...rest,
      hasVoted: Array.isArray(votes) && votes.length > 0,
    }

    return NextResponse.json({ idea: ideaWithVoteStatus })
  } catch (error) {
    console.error("[GET /api/ideas/[id]]", error)
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idea = await db.idea.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    if (idea.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const editableStatuses: IdeaStatus[] = [IdeaStatus.DRAFT, IdeaStatus.PENDING]
    if (!editableStatuses.includes(idea.status)) {
      return NextResponse.json(
        { error: "Idea can only be edited when in DRAFT or PENDING status" },
        { status: 422 }
      )
    }

    const body = await request.json()
    const { title, description, category, images } = body

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 })
      }
      updateData.title = title.trim()
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length === 0) {
        return NextResponse.json(
          { error: "Description cannot be empty" },
          { status: 400 }
        )
      }
      updateData.description = description.trim()
    }

    if (category !== undefined) {
      if (!Object.values(IdeaCategory).includes(category as IdeaCategory)) {
        return NextResponse.json(
          { error: `Invalid category` },
          { status: 400 }
        )
      }
      updateData.category = category as IdeaCategory
    }

    if (images !== undefined) {
      updateData.images = Array.isArray(images)
        ? images.filter((i: unknown) => typeof i === "string")
        : []
    }

    const updated = await db.idea.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ idea: updated })
  } catch (error) {
    console.error("[PUT /api/ideas/[id]]", error)
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const idea = await db.idea.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    const isAdmin =
      // @ts-expect-error - augmented session type
      session.user.role === "ADMIN"
    const isAuthor = idea.authorId === session.user.id

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.idea.delete({ where: { id } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[DELETE /api/ideas/[id]]", error)
    return NextResponse.json(
      { error: "Failed to delete idea" },
      { status: 500 }
    )
  }
}
