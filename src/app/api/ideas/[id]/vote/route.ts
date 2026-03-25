import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { IdeaStage, IdeaStatus } from "@/generated/prisma/client"

type RouteParams = { params: Promise<{ id: string }> }

/**
 * Compute the stage a given vote count maps to.
 *  0–9   => SEED
 *  10–29 => SPROUT
 *  30–49 => TREE
 *  50–99 => FLOWER
 *  100+  => FRUIT
 */
function stageFromVoteCount(count: number): IdeaStage {
  if (count >= 100) return IdeaStage.FRUIT
  if (count >= 50) return IdeaStage.FLOWER
  if (count >= 30) return IdeaStage.TREE
  if (count >= 10) return IdeaStage.SPROUT
  return IdeaStage.SEED
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Verify idea exists and is published
    const idea = await db.idea.findUnique({
      where: { id },
      select: { id: true, status: true, voteCount: true },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    if (idea.status !== IdeaStatus.PUBLISHED) {
      return NextResponse.json(
        { error: "Voting is only allowed on published ideas" },
        { status: 422 }
      )
    }

    // Check if user has already voted
    const existingVote = await db.vote.findUnique({
      where: { userId_ideaId: { userId, ideaId: id } },
    })

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted for this idea" },
        { status: 409 }
      )
    }

    // Create vote + update idea voteCount and stage atomically
    const newVoteCount = idea.voteCount + 1
    const newStage = stageFromVoteCount(newVoteCount)

    const [vote, updatedIdea] = await db.$transaction([
      db.vote.create({ data: { userId, ideaId: id } }),
      db.idea.update({
        where: { id },
        data: { voteCount: newVoteCount, stage: newStage },
        select: { id: true, voteCount: true, stage: true },
      }),
    ])

    return NextResponse.json(
      { vote, idea: updatedIdea, hasVoted: true },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/ideas/[id]/vote]", error)
    return NextResponse.json(
      { error: "Failed to cast vote" },
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

    const userId = session.user.id

    // Verify idea exists
    const idea = await db.idea.findUnique({
      where: { id },
      select: { id: true, voteCount: true },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    // Verify vote exists
    const existingVote = await db.vote.findUnique({
      where: { userId_ideaId: { userId, ideaId: id } },
    })

    if (!existingVote) {
      return NextResponse.json(
        { error: "You have not voted for this idea" },
        { status: 404 }
      )
    }

    // Remove vote + update voteCount and stage atomically
    const newVoteCount = Math.max(0, idea.voteCount - 1)
    const newStage = stageFromVoteCount(newVoteCount)

    const [, updatedIdea] = await db.$transaction([
      db.vote.delete({ where: { userId_ideaId: { userId, ideaId: id } } }),
      db.idea.update({
        where: { id },
        data: { voteCount: newVoteCount, stage: newStage },
        select: { id: true, voteCount: true, stage: true },
      }),
    ])

    return NextResponse.json({ idea: updatedIdea, hasVoted: false })
  } catch (error) {
    console.error("[DELETE /api/ideas/[id]/vote]", error)
    return NextResponse.json(
      { error: "Failed to remove vote" },
      { status: 500 }
    )
  }
}
