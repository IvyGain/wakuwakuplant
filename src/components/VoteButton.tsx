"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoteButtonProps {
  ideaId: string;
  initialVoteCount: number;
  initialHasVoted?: boolean;
  isAuthenticated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onVoteChange?: (hasVoted: boolean, newCount: number) => void;
}

export function VoteButton({
  ideaId,
  initialVoteCount,
  initialHasVoted = false,
  isAuthenticated = false,
  size = "md",
  className,
  onVoteChange,
}: VoteButtonProps) {
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const sizeClasses = {
    sm: "h-10 px-3 text-sm gap-1.5",
    md: "h-12 px-4 text-base gap-2",
    lg: "h-14 px-6 text-lg gap-2.5",
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  async function handleVote() {
    if (!isAuthenticated) {
      toast.error("投票するにはログインが必要です", {
        description: "ログインページへ移動してください",
        action: {
          label: "ログイン",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    // Spawn particles
    setParticles(Array.from({ length: 6 }, (_, i) => i));
    setTimeout(() => setParticles([]), 800);

    const wasVoted = hasVoted;
    const newVoted = !wasVoted;
    const newCount = newVoted ? voteCount + 1 : voteCount - 1;

    // Optimistic update
    setHasVoted(newVoted);
    setVoteCount(newCount);

    try {
      const res = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: newVoted ? "POST" : "DELETE",
      });

      if (!res.ok) {
        // Revert on error
        setHasVoted(wasVoted);
        setVoteCount(voteCount);
        toast.error("エラーが発生しました。もう一度お試しください。");
        return;
      }

      const data = await res.json();
      setVoteCount(data.voteCount ?? newCount);
      onVoteChange?.(newVoted, data.voteCount ?? newCount);

      if (newVoted) {
        toast.success("投票しました！", {
          description: "アイデアが成長しています 🌱",
        });
      }
    } catch {
      setHasVoted(wasVoted);
      setVoteCount(voteCount);
      toast.error("エラーが発生しました。");
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* Particle burst */}
      <AnimatePresence>
        {particles.map((i) => {
          const angle = (i / 6) * 360;
          const distance = 30 + Math.random() * 20;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  i % 3 === 0
                    ? "#7BC67E"
                    : i % 3 === 1
                    ? "#F2C94C"
                    : "#E8A0BF",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.2, 0],
                x: Math.cos((angle * Math.PI) / 180) * distance,
                y: Math.sin((angle * Math.PI) / 180) * distance,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          );
        })}
      </AnimatePresence>

      <motion.button
        onClick={handleVote}
        disabled={isLoading}
        className={cn(
          "relative inline-flex items-center justify-center font-bold rounded-2xl",
          "transition-all duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          sizeClasses[size],
          hasVoted
            ? "bg-[#2D5A3D] text-white focus-visible:ring-[#2D5A3D] shadow-lg shadow-[#2D5A3D]/20"
            : "bg-[#F7F5F0] text-[#3D2E1F] border-2 border-[#E8E2D8] hover:border-[#7BC67E] hover:bg-[#F0FAF0] focus-visible:ring-[#7BC67E]"
        )}
        whileHover={{ scale: isLoading ? 1 : 1.05 }}
        whileTap={{ scale: isLoading ? 1 : 0.95 }}
        animate={
          isAnimating && hasVoted
            ? { scale: [1, 1.2, 0.95, 1.08, 1] }
            : {}
        }
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.span
          animate={
            isAnimating
              ? { rotate: [0, -15, 20, -10, 0], scale: [1, 1.3, 0.9, 1.15, 1] }
              : { rotate: 0 }
          }
          transition={{ duration: 0.5 }}
        >
          <Sprout
            size={iconSize[size]}
            className={cn(
              "transition-colors",
              hasVoted ? "text-[#7BC67E]" : "text-[#7BC67E]"
            )}
          />
        </motion.span>

        <motion.span
          key={voteCount}
          initial={{ y: hasVoted ? -10 : 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="tabular-nums"
        >
          {voteCount.toLocaleString("ja-JP")}
        </motion.span>

        {hasVoted && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs opacity-80"
          >
            投票済み
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
