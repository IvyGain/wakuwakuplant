"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Share,
  Link2,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { PlantStage } from "@/components/PlantStage";
import { VoteButton } from "@/components/VoteButton";
import { IdeaCard } from "@/components/IdeaCard";
import { Badge } from "@/components/ui/badge";
import {
  type Idea,
  STAGE_CONFIG,
  CATEGORY_OPTIONS,
  getCategoryLabel,
  getCategoryEmoji,
} from "@/types";
import { cn } from "@/lib/utils";

function ProgressBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full h-3 bg-[#E8E2D8] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
}

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [related, setRelated] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    async function fetchIdea() {
      try {
        const res = await fetch(`/api/ideas/${id}`);
        if (!res.ok) {
          router.push("/ideas");
          return;
        }
        const data = await res.json();
        setIdea(data.idea ?? data);
      } catch {
        router.push("/ideas");
      } finally {
        setLoading(false);
      }
    }
    fetchIdea();
  }, [id, router]);

  useEffect(() => {
    if (!idea) return;
    fetch(`/api/ideas?category=${idea.category}&limit=3&status=PUBLISHED`)
      .then((r) => r.json())
      .then((d) => {
        const filtered = (d.ideas ?? []).filter((i: Idea) => i.id !== id);
        setRelated(filtered.slice(0, 3));
      })
      .catch(() => {});
  }, [idea, id]);

  function handleVoteChange(hasVoted: boolean, newCount: number) {
    if (!idea) return;
    setIdea({ ...idea, voteCount: newCount, hasVoted });
  }

  async function handleShare(type: "twitter" | "copy") {
    const url = window.location.href;
    const text = `「${idea?.title}」に投票しよう！ #わくわくプラント #こどもAI発明家`;

    if (type === "twitter") {
      window.open(
        `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("URLをコピーしました！");
    }
    setShareOpen(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-[#7BC67E] animate-spin mx-auto mb-4" />
          <p className="text-[#8B6F47] font-semibold">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  const stageConfig = STAGE_CONFIG[idea.stage];
  const categoryOption = CATEGORY_OPTIONS.find((c) => c.value === idea.category);
  const NEXT_STAGE_MAP: Record<string, { stage: string; votes: number }> = {
    SEED: { stage: "芽", votes: 10 },
    SPROUT: { stage: "木", votes: 50 },
    TREE: { stage: "花", votes: 200 },
    FLOWER: { stage: "実", votes: 500 },
    FRUIT: { stage: "実（最高段階）", votes: Infinity },
  };
  const nextStage = NEXT_STAGE_MAP[idea.stage];
  const progressMax = nextStage.votes;
  const progressCurrent = Math.min(idea.voteCount, progressMax);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#2D5A3D] font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          アイデア一覧に戻る
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-sm"
            >
              {/* Color top strip */}
              <div className="h-2" style={{ backgroundColor: stageConfig.color }} />

              <div className="p-6 sm:p-8">
                {/* Category + Stage */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${categoryOption?.color ?? "#8B6F47"}15`,
                      color: categoryOption?.color ?? "#8B6F47",
                    }}
                  >
                    {getCategoryEmoji(idea.category)} {getCategoryLabel(idea.category)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full text-white"
                    style={{ backgroundColor: stageConfig.color }}
                  >
                    {stageConfig.emoji} {stageConfig.label}ステージ
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#1A2E1A] mb-4 leading-snug">
                  {idea.title}
                </h1>

                {/* Author + date */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: stageConfig.color }}
                  >
                    {idea.author?.image ? (
                      <img
                        src={idea.author.image}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (idea.author?.nickname ?? idea.author?.name ?? "?")[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#3D2E1F] text-sm">
                      {idea.author?.nickname ?? idea.author?.name ?? "匿名の発明家"}
                    </p>
                    <div className="flex items-center gap-1 text-[#8B6F47] text-xs">
                      <Calendar size={11} />
                      {new Date(idea.createdAt).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-[#3D2E1F] text-base leading-relaxed whitespace-pre-wrap">
                    {idea.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Related ideas */}
            {related.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-black text-[#1A2E1A] text-xl mb-4">
                  関連アイデア
                </h2>
                <div className="space-y-4">
                  {related.map((rel) => (
                    <IdeaCard
                      key={rel.id}
                      idea={rel}
                      isAuthenticated={!!session}
                      variant="compact"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Plant visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="bg-white rounded-3xl border border-[#E8E2D8] p-6 text-center shadow-sm"
            >
              <PlantStage stage={idea.stage} size="xl" animated showLabel />

              <div className="mt-4">
                <p className="text-3xl font-black tabular-nums" style={{ color: stageConfig.color }}>
                  {idea.voteCount.toLocaleString("ja-JP")}
                </p>
                <p className="text-sm text-[#8B6F47] font-semibold">票獲得中</p>
              </div>

              {/* Progress to next stage */}
              {idea.stage !== "FRUIT" && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#8B6F47] font-semibold mb-1.5">
                    <span>次のステージまで</span>
                    <span>
                      {Math.max(0, progressMax - progressCurrent)}票
                    </span>
                  </div>
                  <ProgressBar
                    current={progressCurrent}
                    max={progressMax}
                    color={stageConfig.color}
                  />
                  <p className="text-xs text-[#8B6F47] mt-1.5 text-right">
                    {nextStage.stage}へ成長！
                  </p>
                </div>
              )}

              {/* Vote button */}
              <div className="mt-5">
                <VoteButton
                  ideaId={idea.id}
                  initialVoteCount={idea.voteCount}
                  initialHasVoted={idea.hasVoted}
                  isAuthenticated={!!session}
                  size="lg"
                  className="w-full justify-center"
                  onVoteChange={handleVoteChange}
                />
                {!session && (
                  <p className="text-xs text-[#8B6F47] mt-2">
                    投票するには
                    <Link href="/login" className="text-[#2D5A3D] font-bold hover:underline mx-1">
                      ログイン
                    </Link>
                    が必要です
                  </p>
                )}
              </div>
            </motion.div>

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E8E2D8] p-4 shadow-sm"
            >
              <p className="font-bold text-[#3D2E1F] text-sm mb-3 flex items-center gap-2">
                <Share2 size={15} />
                シェアして広める
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-xl text-sm font-bold hover:bg-[#1DA1F2]/20 transition-colors"
                >
                  <Share size={15} />
                  X
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#F7F5F0] text-[#8B6F47] rounded-xl text-sm font-bold hover:bg-[#F0FAF0] transition-colors"
                >
                  <Link2 size={15} />
                  URLコピー
                </button>
              </div>
            </motion.div>

            {/* Stage guide */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#F7F5F0] rounded-2xl border border-[#E8E2D8] p-4"
            >
              <p className="font-bold text-[#3D2E1F] text-sm mb-3">成長ステージ</p>
              <div className="space-y-2">
                {Object.entries(STAGE_CONFIG).map(([key, cfg]) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-xl text-sm transition-all",
                      idea.stage === key
                        ? "bg-white shadow-sm border border-[#E8E2D8]"
                        : "opacity-50"
                    )}
                  >
                    <span className="text-lg w-8 text-center">{cfg.emoji}</span>
                    <div className="flex-1">
                      <span className="font-bold" style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-[#8B6F47] text-xs ml-1.5">
                        {cfg.minVotes}〜{cfg.maxVotes === Infinity ? "∞" : cfg.maxVotes}票
                      </span>
                    </div>
                    {idea.stage === key && (
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color }}>
                        現在
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
