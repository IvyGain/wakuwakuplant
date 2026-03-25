"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { IdeaCard } from "@/components/IdeaCard";
import type { Idea } from "@/types";

const MOCK_IDEAS: Idea[] = [
  {
    id: "1",
    title: "AIが宿題を先生のように教えてくれるアプリ",
    description: "勉強が苦手な子でも、AIが優しく宿題を手伝ってくれるアプリ。答えをすぐに教えるのではなく、ヒントをくれながら一緒に考えてくれます。",
    category: "SCHOOL",
    authorId: "u1",
    status: "PUBLISHED",
    stage: "FLOWER",
    voteCount: 342,
    images: [],
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: "u1", name: "Yuki", nickname: "ゆき", email: null, emailVerified: null, image: null, role: "CHILD", parentId: null, createdAt: "", updatedAt: "" },
    hasVoted: false,
  },
  {
    id: "2",
    title: "ゴミを分類してリサイクルのやり方を教えてくれるカメラ",
    description: "スマホのカメラをゴミにかざすと、AIが自動でどの分別区分に入れればいいか教えてくれます。地球環境を守るためのアプリです！",
    category: "ENVIRONMENT",
    authorId: "u2",
    status: "PUBLISHED",
    stage: "TREE",
    voteCount: 156,
    images: [],
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: "u2", name: "Hana", nickname: "はな", email: null, emailVerified: null, image: null, role: "CHILD", parentId: null, createdAt: "", updatedAt: "" },
    hasVoted: false,
  },
  {
    id: "3",
    title: "夜に怖い夢を見たらAIが優しく話しかけてくれる枕",
    description: "眠っているときに怖い夢を見ると、枕に内蔵されたAIが「大丈夫だよ」と優しく声をかけてくれます。子どもの夜泣きも防げます。",
    category: "HEALTH",
    authorId: "u3",
    status: "PUBLISHED",
    stage: "SPROUT",
    voteCount: 47,
    images: [],
    createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: "u3", name: "Ryo", nickname: "りょう", email: null, emailVerified: null, image: null, role: "CHILD", parentId: null, createdAt: "", updatedAt: "" },
    hasVoted: false,
  },
];

export function FeaturedIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const res = await fetch("/api/ideas?sort=popular&limit=3&status=PUBLISHED");
        if (res.ok) {
          const data = await res.json();
          if (data.ideas?.length > 0) {
            setIdeas(data.ideas);
          }
        }
      } catch {
        // Use mock data as fallback
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F2C94C]/15 text-[#8B6F47] rounded-full px-4 py-1.5 text-sm font-bold mb-3">
              <TrendingUp size={14} className="text-[#F2C94C]" />
              注目のアイデア
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A2E1A]">
              今週の人気アイデア
            </h2>
            <p className="text-[#8B6F47] mt-2">みんなから投票を集めているアイデアをチェック！</p>
          </div>

          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 text-[#2D5A3D] font-bold hover:text-[#1E3E2A] transition-colors group shrink-0"
          >
            すべて見る
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-[#F7F5F0] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ideas.map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <IdeaCard
                  idea={idea}
                  variant={i === 0 ? "featured" : "default"}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
