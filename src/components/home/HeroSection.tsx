"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sprout, ArrowRight } from "lucide-react";

const FLOATING_ELEMENTS = [
  { emoji: "🌱", x: 8, y: 15, delay: 0, scale: 1.2 },
  { emoji: "🍃", x: 85, y: 20, delay: 0.5, scale: 0.9 },
  { emoji: "🌸", x: 15, y: 65, delay: 1.0, scale: 1.0 },
  { emoji: "🌿", x: 80, y: 70, delay: 0.3, scale: 1.1 },
  { emoji: "🌻", x: 50, y: 8, delay: 0.8, scale: 0.8 },
  { emoji: "🍀", x: 92, y: 45, delay: 1.2, scale: 0.9 },
  { emoji: "🌾", x: 5, y: 45, delay: 0.6, scale: 1.0 },
  { emoji: "🌰", x: 60, y: 85, delay: 1.5, scale: 0.85 },
  { emoji: "🌺", x: 35, y: 90, delay: 0.4, scale: 0.95 },
];

function GrowingPlantAnimation() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Ground circle */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-[#5C4033]/20 rounded-full blur-sm"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      />

      {/* Soil mound */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
      >
        <div className="w-20 h-12 bg-[#6B4226] rounded-t-full rounded-b-none" />
        <div className="w-28 h-6 bg-[#5C3A20] rounded-full -mt-3" />
      </motion.div>

      {/* Stem */}
      <motion.div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 w-3 rounded-full bg-[#5A9B5E]"
        initial={{ height: 0, transformOrigin: "bottom" }}
        animate={{ height: 72 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      />

      {/* Left leaf */}
      <motion.div
        className="absolute bottom-28 left-1/2 -translate-x-full"
        initial={{ scale: 0, rotate: 30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
      >
        <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
          <path d="M48 20 Q30 0 0 10 Q10 30 48 20Z" fill="#7BC67E" opacity="0.9" />
          <path d="M48 20 Q30 0 0 10" stroke="#5EAD62" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>

      {/* Right leaf */}
      <motion.div
        className="absolute bottom-32 left-1/2"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, duration: 0.4, type: "spring" }}
      >
        <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
          <path d="M0 20 Q18 0 48 10 Q38 30 0 20Z" fill="#5EAD62" opacity="0.85" />
        </svg>
      </motion.div>

      {/* Flower head */}
      <motion.div
        className="absolute bottom-[86px] left-1/2 -translate-x-1/2"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.7, duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="text-5xl leading-none">🌸</div>
      </motion.div>

      {/* Sparkles */}
      {[
        { x: -30, y: -20, delay: 2.0 },
        { x: 40, y: -35, delay: 2.2 },
        { x: -15, y: -45, delay: 2.4 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute bottom-28 left-1/2 text-lg pointer-events-none"
          style={{ x: pos.x, y: pos.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0],
            y: [pos.y, pos.y - 15, pos.y - 20],
          }}
          transition={{
            delay: pos.delay,
            duration: 1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-organic-gradient overflow-hidden">
      {/* Background botanical decorations */}
      {FLOATING_ELEMENTS.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl pointer-events-none select-none"
          style={{ left: `${el.x}%`, top: `${el.y}%`, fontSize: `${el.scale * 2}rem` }}
          animate={{
            y: [0, -12, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            delay: el.delay,
            duration: 4 + el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      {/* Background blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#7BC67E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#F2C94C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-[#E8A0BF]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#2D5A3D]/8 text-[#2D5A3D] rounded-full px-5 py-2 text-sm font-bold mb-6 border border-[#2D5A3D]/15"
            >
              <Sprout size={16} className="text-[#7BC67E]" />
              こどもAI発明家プラットフォーム
              <span className="text-[#7BC67E]">🌱</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A2E1A] leading-tight mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="block"
              >
                アイデアの種を
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="block text-[#2D5A3D]"
              >
                まき、みんなで
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="block relative"
              >
                <span className="relative z-10">育てよう</span>
                <motion.span
                  className="absolute bottom-1 left-0 right-0 h-4 bg-[#F2C94C]/40 -z-0 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                />
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-lg text-[#8B6F47] leading-relaxed mb-10 max-w-lg"
            >
              子どもたちのAIアイデアを投稿して、
              みんなの投票で<strong className="text-[#2D5A3D]">種から芽へ、木へ、花へ、実へ</strong>と育てよう！
              あなたのアイデアが世界を変えるかもしれない。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/ideas/new"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-[#2D5A3D] text-white rounded-2xl font-black text-lg shadow-lg shadow-[#2D5A3D]/25 hover:bg-[#1E3E2A] hover:shadow-xl hover:shadow-[#2D5A3D]/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sprout size={22} />
                アイデアを投稿する
              </Link>
              <Link
                href="/ideas"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-[#FAF8F3] text-[#3D2E1F] border-2 border-[#E8E2D8] rounded-2xl font-bold text-lg hover:border-[#7BC67E] hover:bg-[#F0FAF0] transition-all"
              >
                みんなのアイデアを見る
                <ArrowRight size={20} className="text-[#2D5A3D]" />
              </Link>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex items-center gap-6 mt-8 pt-6 border-t border-[#E8E2D8]"
            >
              {[
                { emoji: "🌱", value: "1,200+", label: "投稿アイデア" },
                { emoji: "🗳️", value: "45,000+", label: "累計投票数" },
                { emoji: "👧", value: "3,500+", label: "参加者" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl">{stat.emoji}</div>
                  <div className="font-black text-[#2D5A3D] text-lg leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#8B6F47] font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Plant animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            className="flex justify-center items-center"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-[#7BC67E]/10 rounded-full blur-2xl scale-125" />
              <div className="relative bg-gradient-to-br from-[#F0FAF0] to-[#E8F5E4] rounded-3xl p-8 shadow-xl shadow-[#2D5A3D]/10 border border-[#D4EDD7]">
                <GrowingPlantAnimation />

                {/* Stage indicators */}
                <div className="flex justify-center gap-3 mt-4">
                  {[
                    { emoji: "🌰", label: "種", active: false },
                    { emoji: "🌱", label: "芽", active: false },
                    { emoji: "🌳", label: "木", active: false },
                    { emoji: "🌸", label: "花", active: true },
                    { emoji: "🍎", label: "実", active: false },
                  ].map((stage, i) => (
                    <motion.div
                      key={i}
                      className="flex flex-col items-center gap-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.0 + i * 0.1 }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                          ${stage.active
                            ? "bg-[#2D5A3D] ring-2 ring-[#7BC67E] ring-offset-2"
                            : "bg-[#F7F5F0]"
                          }`}
                      >
                        {stage.emoji}
                      </div>
                      <span className="text-xs font-bold text-[#8B6F47]">
                        {stage.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full" fill="white">
          <path d="M0,32 C240,64 480,0 720,32 C960,64 1200,16 1440,32 L1440,64 L0,64 Z" opacity="0.4" />
          <path d="M0,48 C360,20 720,60 1080,40 C1260,32 1380,48 1440,48 L1440,64 L0,64 Z" />
        </svg>
      </div>
    </section>
  );
}
