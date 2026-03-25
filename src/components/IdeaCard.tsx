"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { PlantStage } from "@/components/PlantStage";
import { VoteButton } from "@/components/VoteButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type Idea,
  CATEGORY_OPTIONS,
  STAGE_CONFIG,
  getCategoryLabel,
  getCategoryEmoji,
} from "@/types";

interface IdeaCardProps {
  idea: Idea;
  isAuthenticated?: boolean;
  className?: string;
  variant?: "default" | "featured" | "compact";
  onVoteChange?: (ideaId: string, hasVoted: boolean, newCount: number) => void;
}

export function IdeaCard({
  idea,
  isAuthenticated = false,
  className,
  variant = "default",
  onVoteChange,
}: IdeaCardProps) {
  const stageConfig = STAGE_CONFIG[idea.stage];
  const categoryOption = CATEGORY_OPTIONS.find((c) => c.value === idea.category);

  const formattedDate = new Date(idea.createdAt).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  });

  const authorInitial = (
    idea.author?.nickname ?? idea.author?.name ?? "?"
  )[0].toUpperCase();

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cn(
          "group rounded-2xl bg-[#FAF8F3] border border-[#E8E2D8]",
          "p-4 flex items-center gap-4 cursor-pointer",
          "transition-shadow duration-200 hover:shadow-md hover:border-[#7BC67E]/40",
          className
        )}
      >
        <Link href={`/ideas/${idea.id}`} className="flex items-center gap-4 flex-1 min-w-0">
          <PlantStage stage={idea.stage} size="sm" animated={false} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#3D2E1F] truncate">{idea.title}</p>
            <p className="text-sm text-[#8B6F47]">
              {getCategoryEmoji(idea.category)} {getCategoryLabel(idea.category)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[#2D5A3D] font-bold shrink-0">
            <span className="text-sm">🌱</span>
            <span className="text-sm tabular-nums">{idea.voteCount}</span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative rounded-2xl bg-[#FAF8F3] border border-[#E8E2D8]",
        "overflow-hidden cursor-pointer",
        "transition-shadow duration-300 hover:shadow-xl hover:shadow-[#2D5A3D]/10",
        "hover:border-[#7BC67E]/50",
        variant === "featured" && "ring-2 ring-[#F2C94C] ring-offset-2",
        className
      )}
    >
      {/* Top decorative strip */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: stageConfig.color }}
      />

      {/* Leaf decoration on hover */}
      <motion.div
        className="absolute top-3 right-3 text-2xl pointer-events-none"
        initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
        whileHover={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {stageConfig.emoji}
      </motion.div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <PlantStage stage={idea.stage} size="sm" animated />

          <div className="flex-1 min-w-0">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${categoryOption?.color ?? "#8B6F47"}18`,
                  color: categoryOption?.color ?? "#8B6F47",
                }}
              >
                {getCategoryEmoji(idea.category)} {getCategoryLabel(idea.category)}
              </span>
              {variant === "featured" && (
                <span className="text-xs font-bold text-[#F2C94C] bg-[#F2C94C]/15 px-2 py-0.5 rounded-full">
                  ✨ 注目
                </span>
              )}
            </div>

            {/* Title */}
            <Link href={`/ideas/${idea.id}`}>
              <h3 className="font-bold text-[#3D2E1F] text-base leading-snug line-clamp-2 hover:text-[#2D5A3D] transition-colors">
                {idea.title}
              </h3>
            </Link>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#8B6F47] text-sm leading-relaxed line-clamp-3 mb-4">
          {idea.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D8]">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: stageConfig.color }}
            >
              {idea.author?.image ? (
                <img
                  src={idea.author.image}
                  alt={idea.author?.name ?? ""}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                authorInitial
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#3D2E1F]">
                {idea.author?.nickname ?? idea.author?.name ?? "匿名"}
              </p>
              <div className="flex items-center gap-1 text-[#8B6F47]">
                <Calendar size={10} />
                <span className="text-xs">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Vote button */}
          <VoteButton
            ideaId={idea.id}
            initialVoteCount={idea.voteCount}
            initialHasVoted={idea.hasVoted}
            isAuthenticated={isAuthenticated}
            size="sm"
            onVoteChange={(hasVoted, count) =>
              onVoteChange?.(idea.id, hasVoted, count)
            }
          />
        </div>
      </div>

      {/* Stage label */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-transform duration-300 group-hover:scale-x-100 scale-x-0 origin-left"
        style={{ backgroundColor: stageConfig.color }}
      />
    </motion.article>
  );
}
