"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, Loader2, Sprout, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { IdeaCard } from "@/components/IdeaCard";
import type { Idea, IdeaCategory, IdeaStage } from "@/types";
import { CATEGORY_OPTIONS } from "@/types";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "popular";

const STAGE_FILTERS: { value: IdeaStage | "ALL"; label: string; emoji: string }[] = [
  { value: "ALL", label: "すべて", emoji: "🌿" },
  { value: "SEED", label: "種", emoji: "🌰" },
  { value: "SPROUT", label: "芽", emoji: "🌱" },
  { value: "TREE", label: "木", emoji: "🌳" },
  { value: "FLOWER", label: "花", emoji: "🌸" },
  { value: "FRUIT", label: "実", emoji: "🍎" },
];

export default function IdeasPage() {
  const { data: session } = useSession();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory | "ALL">("ALL");
  const [selectedStage, setSelectedStage] = useState<IdeaStage | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchIdeas = useCallback(
    async (pageNum: number, reset: boolean) => {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: "12",
        sort: sortBy === "popular" ? "popular" : "newest",
      });
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (selectedStage !== "ALL") params.set("stage", selectedStage);
      if (debouncedQuery) params.set("search", debouncedQuery);

      if (reset) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(`/api/ideas?${params}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        setIdeas((prev) => (reset ? data.ideas ?? [] : [...prev, ...(data.ideas ?? [])]));
        setHasMore(data.pagination?.hasNext ?? data.hasMore ?? false);
        setTotal(data.pagination?.total ?? data.total ?? 0);
        setPage(pageNum);
      } catch {
        // keep existing data
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sortBy, selectedCategory, selectedStage, debouncedQuery]
  );

  useEffect(() => {
    fetchIdeas(1, true);
  }, [fetchIdeas]);

  function handleVoteChange(ideaId: string, hasVoted: boolean, newCount: number) {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, voteCount: newCount, hasVoted } : idea
      )
    );
  }

  const activeFilterCount =
    (selectedCategory !== "ALL" ? 1 : 0) + (selectedStage !== "ALL" ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Page header */}
      <div className="bg-gradient-to-br from-[#F0FAF0] to-[#FAF8F3] border-b border-[#E8E2D8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#2D5A3D]/8 text-[#2D5A3D] rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Sprout size={14} />
              みんなのアイデア
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1A2E1A] mb-2">
              アイデア一覧
            </h1>
            <p className="text-[#8B6F47]">
              <span className="font-bold text-[#2D5A3D]">{total.toLocaleString("ja-JP")}</span>
              件のアイデアが育っています
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filter bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6F47]" />
              <input
                type="text"
                placeholder="アイデアを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-white border border-[#E8E2D8] rounded-2xl text-[#3D2E1F] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:ring-2 focus:ring-[#7BC67E]/20 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F47] hover:text-[#3D2E1F]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              {(["popular", "newest"] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={cn(
                    "h-12 px-4 rounded-2xl font-semibold text-sm transition-all",
                    sortBy === opt
                      ? "bg-[#2D5A3D] text-white shadow-sm"
                      : "bg-white text-[#8B6F47] border border-[#E8E2D8] hover:border-[#7BC67E]"
                  )}
                >
                  {opt === "popular" ? "🔥 人気順" : "🆕 新着順"}
                </button>
              ))}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "h-12 px-4 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2",
                  showFilters || activeFilterCount > 0
                    ? "bg-[#F2C94C] text-[#3D2E1F]"
                    : "bg-white text-[#8B6F47] border border-[#E8E2D8] hover:border-[#7BC67E]"
                )}
              >
                <SlidersHorizontal size={16} />
                フィルター
                {activeFilterCount > 0 && (
                  <span className="bg-[#2D5A3D] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter panels */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl border border-[#E8E2D8] p-4 space-y-4">
                  {/* Category filter */}
                  <div>
                    <p className="text-xs font-bold text-[#8B6F47] uppercase tracking-wider mb-2">
                      カテゴリ
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory("ALL")}
                        className={cn(
                          "h-9 px-3.5 rounded-xl text-sm font-semibold transition-all",
                          selectedCategory === "ALL"
                            ? "bg-[#2D5A3D] text-white"
                            : "bg-[#F7F5F0] text-[#8B6F47] hover:bg-[#F0FAF0]"
                        )}
                      >
                        すべて
                      </button>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setSelectedCategory(cat.value)}
                          className={cn(
                            "h-9 px-3.5 rounded-xl text-sm font-semibold transition-all",
                            selectedCategory === cat.value
                              ? "text-white"
                              : "bg-[#F7F5F0] text-[#8B6F47] hover:bg-[#F0FAF0]"
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
                  </div>

                  {/* Stage filter */}
                  <div>
                    <p className="text-xs font-bold text-[#8B6F47] uppercase tracking-wider mb-2">
                      成長段階
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {STAGE_FILTERS.map((stage) => (
                        <button
                          key={stage.value}
                          onClick={() => setSelectedStage(stage.value)}
                          className={cn(
                            "h-9 px-3.5 rounded-xl text-sm font-semibold transition-all",
                            selectedStage === stage.value
                              ? "bg-[#2D5A3D] text-white"
                              : "bg-[#F7F5F0] text-[#8B6F47] hover:bg-[#F0FAF0]"
                          )}
                        >
                          {stage.emoji} {stage.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory("ALL");
                        setSelectedStage("ALL");
                      }}
                      className="text-sm text-[#8B6F47] hover:text-[#3D2E1F] flex items-center gap-1"
                    >
                      <X size={14} />
                      フィルターをクリア
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ideas grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-white border border-[#E8E2D8] animate-pulse" />
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-[#3D2E1F] mb-2">
              まだアイデアがありません
            </h3>
            <p className="text-[#8B6F47] mb-6">
              最初のアイデアを投稿してみましょう！
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {ideas.map((idea, i) => (
                  <motion.div
                    key={idea.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <IdeaCard
                      idea={idea}
                      isAuthenticated={!!session}
                      onVoteChange={handleVoteChange}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => fetchIdeas(page + 1, false)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 h-12 px-8 bg-[#2D5A3D] text-white rounded-2xl font-bold hover:bg-[#1E3E2A] transition-colors disabled:opacity-60"
                >
                  {loadingMore ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Sprout size={18} />
                  )}
                  もっと見る
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
