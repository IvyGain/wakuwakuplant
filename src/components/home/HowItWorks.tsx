"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    emoji: "🌰",
    stage: "種",
    stageEn: "SEED",
    color: "#8B6F47",
    bgColor: "rgba(139, 111, 71, 0.1)",
    votes: "0〜9票",
    title: "アイデアを投稿する",
    description: "あなたのAIアイデアを種として植えます。タイトルと説明を書くだけで簡単！",
  },
  {
    emoji: "🌱",
    stage: "芽",
    stageEn: "SPROUT",
    color: "#7BC67E",
    bgColor: "rgba(123, 198, 126, 0.1)",
    votes: "10〜49票",
    title: "みんなが投票する",
    description: "仲間たちが素敵なアイデアに投票すると、種が芽を出して成長します！",
  },
  {
    emoji: "🌳",
    stage: "木",
    stageEn: "TREE",
    color: "#2D5A3D",
    bgColor: "rgba(45, 90, 61, 0.1)",
    votes: "50〜199票",
    title: "アイデアが大きく育つ",
    description: "投票が増えるほどアイデアは成長。木のように大きく、強くなっていきます。",
  },
  {
    emoji: "🌸",
    stage: "花",
    stageEn: "FLOWER",
    color: "#E8A0BF",
    bgColor: "rgba(232, 160, 191, 0.1)",
    votes: "200〜499票",
    title: "注目のアイデアに！",
    description: "たくさんの投票を集めたアイデアは花を咲かせ、みんなの注目を集めます。",
  },
  {
    emoji: "🍎",
    stage: "実",
    stageEn: "FRUIT",
    color: "#F2C94C",
    bgColor: "rgba(242, 201, 76, 0.12)",
    votes: "500票以上",
    title: "夢が実る！",
    description: "最も人気のアイデアは実を結び、実現に向けた取り組みがスタートします！",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-[#2D5A3D]/8 text-[#2D5A3D] rounded-full px-4 py-1.5 text-sm font-bold mb-4">
            🌱 成長の5ステップ
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1A2E1A] mb-4">
            アイデアはこうして育つ
          </h2>
          <p className="text-[#8B6F47] text-lg max-w-xl mx-auto">
            投票を集めるほど、あなたのアイデアが成長します。
            種から実へ、5段階の成長を楽しもう！
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#8B6F47] via-[#7BC67E] via-[#2D5A3D] via-[#E8A0BF] to-[#F2C94C] z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-md border-2"
                  style={{
                    backgroundColor: step.bgColor,
                    borderColor: `${step.color}30`,
                  }}
                >
                  {step.emoji}
                </motion.div>

                {/* Stage badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 text-white"
                  style={{ backgroundColor: step.color }}
                >
                  <span>{step.stage}</span>
                  <span className="opacity-70">({step.votes})</span>
                </div>

                <h3 className="font-bold text-[#3D2E1F] text-sm mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#8B6F47] leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow between steps (mobile) */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden mt-4 text-[#C8C0B4]">
                    <ArrowRight size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
