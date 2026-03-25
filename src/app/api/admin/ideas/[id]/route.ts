import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { IdeaStatus } from "@/generated/prisma/client"

type RouteParams = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // @ts-expect-error - augmented session type
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const idea = await db.idea.findUnique({
      where: { id },
      select: { id: true, status: true },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    const body = await request.json()
    const { action, reason } = body

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    if (action === "reject" && (!reason || typeof reason !== "string" || reason.trim().length === 0)) {
      return NextResponse.json(
        { error: "A rejection reason is required" },
        { status: 400 }
      )
    }

    const newStatus =
      action === "approve" ? IdeaStatus.PUBLISHED : IdeaStatus.DRAFT

    const updated = await db.idea.update({
      where: { id },
      data: { status: newStatus },
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
      },
    })

    // Notify the author if the platform has a notification system
    if (updated.author) {
      const notificationTitle =
        action === "approve" ? "アイデアが承認されました" : "アイデアが差し戻されました"
      const notificationBody =
        action === "approve"
          ? `あなたのアイデア「${updated.title}」が承認・公開されました。`
          : `あなたのアイデア「${updated.title}」が差し戻されました。理由: ${reason?.trim()}`

      await db.notification.create({
        data: {
          userId: updated.authorId,
          type: action === "approve" ? "IDEA_APPROVED" : "IDEA_REJECTED",
          title: notificationTitle,
          body: notificationBody,
        },
      })
    }

    return NextResponse.json({
      idea: updated,
      action,
      ...(action === "reject" ? { reason: reason?.trim() } : {}),
    })
  } catch (error) {
    console.error("[PUT /api/admin/ideas/[id]]", error)
    return NextResponse.json(
      { error: "Failed to update idea status" },
      { status: 500 }
    )
  }
}
