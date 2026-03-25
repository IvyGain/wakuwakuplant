"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import React from "react";
import { X, Loader2, Sprout, Info } from "lucide-react";
import {
  type Idea,
  STAGE_CONFIG,
  getCategoryLabel,
  getCategoryEmoji,
} from "@/types";

// ─────────────────────────────────────────────
// Plant visual for each stage (in-forest mini version)
// ─────────────────────────────────────────────
function ForestPlant({
  stage,
  size,
  isHovered,
}: {
  stage: Idea["stage"];
  size: number;
  isHovered: boolean;
}) {
  const cfg = STAGE_CONFIG[stage];

  const plants: Record<Idea["stage"], React.ReactElement> = {
    SEED: (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <ellipse cx="24" cy="36" rx="10" ry="4" fill="#5C4033" opacity="0.3" />
        <ellipse cx="24" cy="30" rx="9" ry="8" fill="#8B6F47" />
        <ellipse cx="24" cy="30" rx="6" ry="5.5" fill="#A68B5B" />
        <ellipse cx="20" cy="27" rx="2.5" ry="1.5" fill="white" opacity="0.3" transform="rotate(-20 20 27)" />
      </svg>
    ),
    SPROUT: (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <ellipse cx="24" cy="42" rx="12" ry="4" fill="#5C4033" opacity="0.3" />
        <path d="M24 42 Q23 36 24 28" stroke="#5A9B5E" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 34 Q16 29 15 22 Q21 24 24 32" fill="#7BC67E" opacity="0.9" />
        <path d="M24 30 Q32 25 33 18 Q27 20 24 28" fill="#5EAD62" opacity="0.85" />
        <ellipse cx="24" cy="25" rx="4" ry="5.5" fill="#7BC67E" transform="rotate(5 24 25)" />
      </svg>
    ),
    TREE: (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <rect x="21" y="36" width="6" height="10" rx="2" fill="#6B4226" />
        <ellipse cx="24" cy="42" rx="14" ry="4" fill="#5C4033" opacity="0.25" />
        <ellipse cx="24" cy="30" rx="18" ry="8" fill="#2D5A3D" />
        <ellipse cx="24" cy="22" rx="14" ry="8" fill="#3D7A52" />
        <ellipse cx="24" cy="14" rx="10" ry="7" fill="#4D9065" />
        <circle cx="18" cy="19" r="2.5" fill="#5EAD62" opacity="0.4" />
        <circle cx="30" cy="16" r="2" fill="#7BC67E" opacity="0.4" />
      </svg>
    ),
    FLOWER: (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <ellipse cx="24" cy="44" rx="12" ry="3" fill="#5C4033" opacity="0.25" />
        <path d="M24 44 Q23 36 24 28" stroke="#5A9B5E" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 36 Q16 32 15 24 Q21 26 24 34" fill="#7BC67E" opacity="0.8" />
        <path d="M24 32 Q32 28 33 20 Q27 22 24 30" fill="#5EAD62" opacity="0.75" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse
            key={i}
            cx={24 + Math.cos((angle * Math.PI) / 180) * 7}
            cy={20 + Math.sin((angle * Math.PI) / 180) * 7}
            rx="4.5"
            ry="6.5"
            fill="#E8A0BF"
            opacity="0.85"
            transform={`rotate(${angle} ${24 + Math.cos((angle * Math.PI) / 180) * 7} ${20 + Math.sin((angle * Math.PI) / 180) * 7})`}
          />
        ))}
        <circle cx="24" cy="20" r="5.5" fill="#F2C94C" />
        <circle cx="24" cy="20" r="3.5" fill="#E8B800" />
      </svg>
    ),
    FRUIT: (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <ellipse cx="24" cy="44" rx="12" ry="3.5" fill="#5C4033" opacity="0.25" />
        <path d="M24 44 Q22 36 24 28" stroke="#5A9B5E" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 36 Q16 32 14 24 Q20 26 24 34" fill="#7BC67E" opacity="0.8" />
        <path d="M15 24 Q10 8 24 6 Q38 8 33 24 Q35 36 24 38 Q13 36 15 24Z" fill="#E8504A" />
        <ellipse cx="18" cy="18" rx="4" ry="6" fill="white" opacity="0.18" transform="rotate(-15 18 18)" />
        <path d="M24 6 Q25 2 26 0" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="26" cy="0" rx="4" ry="3" fill="#5EAD62" transform="rotate(10 26 0)" />
      </svg>
    ),
  };

  return (
    <motion.div
      animate={
        isHovered
          ? { y: [-2, -8, -2], scale: [1, 1.1, 1] }
          : { y: [0, -3, 0] }
      }
      transition={{
        duration: isHovered ? 0.5 : 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {plants[stage]}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────

const MOCK_IDEAS: Idea[] = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  title: [
    "AI宿題ヘルパー", "ゴミ分別カメラ", "夢ケア枕", "病気応援ロボット",
    "環境クリーナー", "迷子ガイドAI", "栄養チェックめがね", "AIアニメーター",
    "植物ケアAI", "AIお料理先生", "宿題チェッカー", "元気チャージドリンク",
    "AIペット", "未来天気AI", "音楽作曲AI", "AIスポーツコーチ",
    "翻訳ロボット", "節電マスター", "AIお医者さん", "水やりロボット",
    "AIファッション", "読書サポートAI", "AIゲームメイカー", "宇宙観察AI",
  ][i],
  description: "すばらしいアイデアです。",
  category: (["SCHOOL", "ENVIRONMENT", "HEALTH", "HEALTH", "ENVIRONMENT", "LIFE", "HEALTH", "PLAY", "LIFE", "LIFE", "SCHOOL", "HEALTH", "PLAY", "ENVIRONMENT", "PLAY", "HEALTH", "SCHOOL", "ENVIRONMENT", "HEALTH", "ENVIRONMENT", "LIFE", "SCHOOL", "PLAY", "ENVIRONMENT"] as Idea["category"][])[i],
  authorId: `u${i + 1}`,
  status: "PUBLISHED",
  stage: (["FLOWER", "TREE", "SPROUT", "SPROUT", "SPROUT", "SEED", "SEED", "SPROUT", "SEED", "SPROUT", "SEED", "SEED", "SPROUT", "TREE", "FLOWER", "FRUIT", "SEED", "SPROUT", "TREE", "SEED", "SEED", "SPROUT", "SEED", "FLOWER"] as Idea["stage"][])[i],
  voteCount: [342, 156, 47, 42, 38, 12, 8, 55, 6, 67, 4, 3, 89, 110, 210, 560, 7, 44, 88, 5, 9, 35, 11, 230][i],
  images: [],
  createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  author: { id: `u${i + 1}`, name: `発明家${i + 1}`, nickname: `発明家${i + 1}`, email: null, emailVerified: null, image: null, role: "CHILD", parentId: null, createdAt: "", updatedAt: "" },
  hasVoted: false,
}));

type PlantPosition = {
  idea: Idea;
  x: number;
  y: number;
  layer: number;
  size: number;
  delay: number;
};

function generatePositions(ideas: Idea[]): PlantPosition[] {
  const positions: PlantPosition[] = [];
  const LAYERS = [
    { y: 60, yVar: 5, size: 56, count: 4, layer: 3 },
    { y: 50, yVar: 8, size: 64, count: 6, layer: 2 },
    { y: 35, yVar: 12, size: 72, count: 8, layer: 1 },
    { y: 18, yVar: 10, size: 56, count: 6, layer: 0 },
  ];

  let ideaIdx = 0;
  LAYERS.forEach(({ y, yVar, size, count, layer }) => {
    for (let i = 0; i < count && ideaIdx < ideas.length; i++, ideaIdx++) {
      const xBase = 5 + (i * 90) / count;
      const xJitter = (Math.random() - 0.5) * 8;
      const yJitter = (Math.random() - 0.5) * yVar;
      positions.push({
        idea: ideas[ideaIdx],
        x: xBase + xJitter,
        y: y + yJitter,
        layer,
        size,
        delay: Math.random() * 2,
      });
    }
  });

  return positions;
}

export default function ForestPage() {
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState<PlantPosition[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const res = await fetch("/api/ideas?status=PUBLISHED&limit=48&sort=popular");
        if (res.ok) {
          const data = await res.json();
          if (data.ideas?.length > 0) setIdeas(data.ideas);
        }
      } catch {}
      finally { setLoading(false); }
    }
    fetchIdeas();
  }, []);

  useEffect(() => {
    setPositions(generatePositions(ideas));
  }, [ideas]);

  const stageGroups = {
    FRUIT: ideas.filter((i) => i.stage === "FRUIT").length,
    FLOWER: ideas.filter((i) => i.stage === "FLOWER").length,
    TREE: ideas.filter((i) => i.stage === "TREE").length,
    SPROUT: ideas.filter((i) => i.stage === "SPROUT").length,
    SEED: ideas.filter((i) => i.stage === "SEED").length,
  };

  return (
    <div className="min-h-screen bg-[#1A2E1A] overflow-hidden" ref={containerRef}>
      {/* Header */}
      <div className="relative z-10 bg-[#1A2E1A]/90 border-b border-[#2D5A3D] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-[#7BC67E]/15 text-[#7BC67E] rounded-full px-4 py-1.5 text-sm font-bold mb-2">
                <Sprout size={14} />
                アイデアの森
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                みんなの森
              </h1>
              <p className="text-[#7BC67E]/70 mt-1 text-sm">
                {ideas.length}本の植物が育っています
              </p>
            </div>

            {/* Stage counts */}
            <div className="flex gap-3 flex-wrap">
              {Object.entries(stageGroups).map(([stage, count]) => {
                const cfg = STAGE_CONFIG[stage as Idea["stage"]];
                return (
                  <div
                    key={stage}
                    className="flex items-center gap-1.5 bg-[#2D5A3D]/60 rounded-xl px-3 py-2"
                  >
                    <span className="text-lg">{cfg.emoji}</span>
                    <span className="font-bold text-white text-sm tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Forest visualization */}
      <div className="relative" style={{ height: "80vh", minHeight: 600 }}>
        {/* Sky gradient layers with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #0D1A0D 0%, #1A2E1A 40%, #243824 70%, #2D5A3D 100%)",
            y: bgY1,
          }}
        />

        {/* Moon */}
        <motion.div
          className="absolute top-8 right-16 w-16 h-16 rounded-full bg-[#F7F5F0]/10"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 35}%`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Ground */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ y: bgY2 }}
        >
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full" style={{ height: 200 }}>
            <path d="M0,120 C240,80 480,140 720,100 C960,60 1200,130 1440,100 L1440,200 L0,200 Z" fill="#2D5A3D" opacity="0.6" />
            <path d="M0,150 C360,110 720,160 1080,130 C1260,115 1380,145 1440,140 L1440,200 L0,200 Z" fill="#3D7A52" opacity="0.5" />
            <path d="M0,170 C480,140 960,180 1440,160 L1440,200 L0,200 Z" fill="#4D9065" opacity="0.7" />
          </svg>
        </motion.div>

        {/* Plants */}
        {!loading && positions.map((pos, i) => {
          const isHovered = hoveredId === pos.idea.id;
          const cfg = STAGE_CONFIG[pos.idea.stage];
          return (
            <motion.div
              key={pos.idea.id}
              className="absolute cursor-pointer"
              style={{
                left: `${pos.x}%`,
                bottom: `${pos.y - 5}%`,
                zIndex: pos.layer + (isHovered ? 20 : 0),
              }}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: pos.delay + i * 0.02,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              onHoverStart={() => setHoveredId(pos.idea.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => setSelectedIdea(pos.idea)}
            >
              <div className="relative flex flex-col items-center">
                <ForestPlant
                  stage={pos.idea.stage}
                  size={pos.size}
                  isHovered={isHovered}
                />

                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      className="absolute bottom-full mb-2 bg-[#1A2E1A]/95 text-white rounded-2xl p-3 shadow-xl border border-[#2D5A3D] whitespace-nowrap z-50 backdrop-blur-sm"
                      style={{ minWidth: 160 }}
                    >
                      <p className="font-bold text-xs leading-snug max-w-[160px] break-words whitespace-normal">
                        {pos.idea.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-xs font-bold"
                          style={{ color: cfg.color }}
                        >
                          {cfg.emoji} {pos.idea.voteCount}票
                        </span>
                        <span className="text-[#7BC67E]/70 text-xs">
                          {getCategoryEmoji(pos.idea.category)}
                        </span>
                      </div>
                      {/* Triangle pointer */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1A2E1A]/95" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 size={40} className="text-[#7BC67E] animate-spin mx-auto mb-3" />
              <p className="text-[#7BC67E] font-semibold">森を育てています...</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend + CTA */}
      <div className="bg-[#1A2E1A] border-t border-[#2D5A3D] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[#7BC67E] font-bold text-sm mb-3 flex items-center gap-2">
                <Info size={14} />
                植物の大きさは成長ステージを表しています
              </p>
              <div className="flex gap-4 flex-wrap">
                {Object.entries(STAGE_CONFIG).map(([stage, cfg]) => (
                  <div key={stage} className="flex items-center gap-2">
                    <span className="text-lg">{cfg.emoji}</span>
                    <span className="text-xs text-[#7BC67E]/70 font-medium">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/ideas/new"
                className="inline-flex items-center gap-2 h-12 px-6 bg-[#F2C94C] text-[#3D2E1F] rounded-2xl font-black hover:bg-[#E8B800] transition-colors shadow-lg"
              >
                <Sprout size={18} />
                種をまく
              </Link>
              <Link
                href="/ideas"
                className="inline-flex items-center gap-2 h-12 px-6 bg-[#2D5A3D] text-white rounded-2xl font-bold hover:bg-[#3D7A52] transition-colors"
              >
                一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Idea detail modal */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedIdea(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#FAF8F3] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-2" style={{ backgroundColor: STAGE_CONFIG[selectedIdea.stage].color }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: STAGE_CONFIG[selectedIdea.stage].color }}
                  >
                    {STAGE_CONFIG[selectedIdea.stage].emoji}
                    {STAGE_CONFIG[selectedIdea.stage].label}ステージ
                  </div>
                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F5F0] text-[#8B6F47] hover:bg-[#E8E2D8] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <h2 className="text-xl font-black text-[#1A2E1A] mb-2 leading-snug">
                  {selectedIdea.title}
                </h2>
                <p className="text-sm text-[#8B6F47] mb-4 line-clamp-3">
                  {selectedIdea.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryEmoji(selectedIdea.category)}</span>
                    <span className="text-sm font-semibold text-[#8B6F47]">
                      {getCategoryLabel(selectedIdea.category)}
                    </span>
                  </div>
                  <Link
                    href={`/ideas/${selectedIdea.id}`}
                    onClick={() => setSelectedIdea(null)}
                    className="inline-flex items-center gap-1.5 h-10 px-5 bg-[#2D5A3D] text-white rounded-xl font-bold text-sm hover:bg-[#1E3E2A] transition-colors"
                  >
                    詳しく見る
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
