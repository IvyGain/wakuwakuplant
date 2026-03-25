"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Trophy, Medal, Star, Loader2, Sprout } from "lucide-react";
import { useSession } from "next-auth/react";
import { PlantStage } from "@/components/PlantStage";
import { VoteButton } from "@/components/VoteButton";
import { IdeaCard } from "@/components/IdeaCard";
import {
  type Idea,
  type IdeaCategory,
  STAGE_CONFIG,
  CATEGORY_OPTIONS,
  getCategoryLabel,
  getCategoryEmoji,
} from "@/types";
import { cn } from "@/lib/utils";

const MOCK_IDEAS: Idea[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  title: [
    "AIが宿題を先生のように教えてくれるアプリ",
    "ゴミを分類してリサイクルを教えてくれるカメラ",
    "夜に怖い夢を見たら優しく話しかけてくれる枕",
    "病気の子どもを励ますAIロボット",
    "老人の体を助けるAIスーツ",
    "海の汚れを自動で掃除するAIロボット",
    "迷子になった時にお家まで案内してくれるAI",
    "食べ物の栄養を教えてくれるAIめがね",
    "絵を描くと動くAIアニメーターアプリ",
    "植物の状態を教えてくれるAIプランター",
  ][i],
  description: "素晴らしいアイデアです。AIの力で世界をより良くします。",
  category: (["SCHOOL", "ENVIRONMENT", "HEALTH", "HEALTH", "HEALTH", "ENVIRONMENT", "LIFE", "HEALTH", "PLAY", "LIFE"] as IdeaCategory[])[i],
  authorId: `u${i + 1}`,
  status: "PUBLISHED",
  stage: (["FLOWER", "TREE", "SPROUT", "SPROUT", "SPROUT", "SPROUT", "SEED", "SEED", "SEED", "SEED"] as Idea["stage"][])[i],
  voteCount: [342, 156, 47, 42, 38, 31, 28, 24, 19, 15][i],
  images: [],
  createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  author: {
    id: `u${i + 1}`,
    name: `発明家${i + 1}`,
    nickname: `発明家${i + 1}`,
    email: null,
    emailVerified: null,
    image: null,
    role: "CHILD",
    parentId: null,
    createdAt: "",
    updatedAt: "",
  },
  hasVoted: false,
}));

export default function RankingPage() {
  const { data: session } = useSession();
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory | "ALL">("ALL");

  useEffect(() => {
    async function fetchRanking() {
      try {
        const params = new URLSearchParams({ sort: "popular", limit: "10", status: "PUBLISHED" });
        if (selectedCategory !== "ALL") params.set("category", selectedCategory);
        const res = await fetch(`/api/ideas?${params}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ideas?.length > 0) setIdeas(data.ideas);
        }
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchRanking();
  }, [selectedCategory]);

  const top3 = ideas.slice(0, 3);
  const rest = ideas.slice(3);

  const PODIUM_ORDER = [top3[1], top3[0], top3[2]].filter(Boolean);
  const PODIUM_HEIGHTS = [120, 160, 100];
  const PODIUM_RANKS = [2, 1, 3];
  const PODIUM_COLORS = ["#C0C0C0", "#F2C94C", "#CD7F32"];
  const PODIUM_ICONS = [
    <Medal size={20} key="silver" className="text-[#C0C0C0]" />,
    <Trophy size={24} key="gold" className="text-[#F2C94C]" />,
    <Medal size={20} key="bronze" className="text-[#CD7F32]" />,
  ];

  function handleVoteChange(ideaId: string, hasVoted: boolean, newCount: number) {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, voteCount: newCount, hasVoted } : idea
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FFF8E0] to-[#FAF8F3] border-b border-[#E8E2D8] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F2C94C]/20 text-[#8B6F47] rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Trophy size={14} className="text-[#F2C94C]" />
              人気アイデアランキング
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1A2E1A] mb-2">
              🏆 ランキング
            </h1>
            <p className="text-[#8B6F47]">
              みんなが選ぶ最高のアイデアはどれ？
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={cn(
              "shrink-0 h-9 px-4 rounded-xl text-sm font-semibold transition-all",
              selectedCategory === "ALL"
                ? "bg-[#2D5A3D] text-white"
                : "bg-white text-[#8B6F47] border border-[#E8E2D8] hover:border-[#7BC67E]"
            )}
          >
            🌿 すべて
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "shrink-0 h-9 px-4 rounded-xl text-sm font-semibold transition-all",
                selectedCategory === cat.value
                  ? "text-white"
                  : "bg-white text-[#8B6F47] border border-[#E8E2D8] hover:border-[#7BC67E]"
              )}
              style={
                selectedCategory === cat.value
                  ? { backgroundColor: cat.color }
                  : {}
              }
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-[#7BC67E] animate-spin" />
          </div>
        ) : (
          <>
            {/* Podium - Top 3 */}
            {top3.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <h2 className="text-center font-black text-[#1A2E1A] text-lg mb-8">
                  🥇 トップ3
                </h2>
                <div className="flex items-end justify-center gap-4">
                  {PODIUM_ORDER.map((idea, i) => {
                    if (!idea) return null;
                    const rank = PODIUM_RANKS[i];
                    const height = PODIUM_HEIGHTS[i];
                    const color = PODIUM_COLORS[i];
                    const isFirst = rank === 1;
                    const stageConfig = STAGE_CONFIG[idea.stage];

                    return (
                      <motion.div
                        key={idea.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex flex-col items-center"
                        style={{ flex: isFirst ? "0 0 220px" : "0 0 180px" }}
                      >
                        {/* Card */}
                        <Link href={`/ideas/${idea.id}`} className="w-full">
                          <div
                            className={cn(
                              "bg-white rounded-2xl border-2 p-4 text-center mb-3 hover:shadow-lg transition-shadow",
                              isFirst && "shadow-xl"
                            )}
                            style={{ borderColor: color }}
                          >
                            <div className="flex justify-center mb-2">
                              {PODIUM_ICONS[i]}
                            </div>
                            <PlantStage
                              stage={idea.stage}
                              size={isFirst ? "md" : "sm"}
                              animated
                              className="mx-auto mb-2"
                            />
                            <p
                              className={cn(
                                "font-black text-[#1A2E1A] leading-snug line-clamp-2 mb-1",
                                isFirst ? "text-sm" : "text-xs"
                              )}
                            >
                              {idea.title}
                            </p>
                            <div
                              className="text-lg font-black tabular-nums"
                              style={{ color: stageConfig.color }}
                            >
                              {idea.voteCount.toLocaleString("ja-JP")}票
                            </div>
                          </div>
                        </Link>

                        {/* Podium block */}
                        <motion.div
                          className="w-full rounded-t-2xl flex items-center justify-center text-white font-black text-2xl"
                          style={{ height, backgroundColor: color }}
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                        >
                          {rank}位
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Ranked list (4-10) */}
            {rest.length > 0 && (
              <div>
                <h2 className="font-black text-[#1A2E1A] text-lg mb-4">
                  4位以下のランキング
                </h2>
                <div className="space-y-3">
                  {rest.map((idea, i) => {
                    const rank = i + 4;
                    const stageConfig = STAGE_CONFIG[idea.stage];
                    return (
                      <motion.div
                        key={idea.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-[#E8E2D8] p-4 flex items-center gap-4 hover:shadow-md hover:border-[#7BC67E]/40 transition-all"
                      >
                        <div className="text-xl font-black text-[#C0B0A0] w-8 text-center shrink-0">
                          {rank}
                        </div>
                        <PlantStage stage={idea.stage} size="sm" animated={false} />
                        <Link href={`/ideas/${idea.id}`} className="flex-1 min-w-0">
                          <p className="font-bold text-[#3D2E1F] truncate">{idea.title}</p>
                          <span className="text-xs text-[#8B6F47]">
                            {getCategoryEmoji(idea.category)} {getCategoryLabel(idea.category)}
                          </span>
                        </Link>
                        <div
                          className="shrink-0 font-black tabular-nums text-sm"
                          style={{ color: stageConfig.color }}
                        >
                          {idea.voteCount.toLocaleString("ja-JP")}票
                        </div>
                        <VoteButton
                          ideaId={idea.id}
                          initialVoteCount={idea.voteCount}
                          initialHasVoted={idea.hasVoted}
                          isAuthenticated={!!session}
                          size="sm"
                          onVoteChange={(hasVoted, count) =>
                            handleVoteChange(idea.id, hasVoted, count)
                          }
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
