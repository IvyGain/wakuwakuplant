"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Lightbulb, ThumbsUp, Users } from "lucide-react";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString("ja-JP")}</span>;
}

const STATS = [
  {
    icon: Lightbulb,
    value: 1248,
    suffix: "+",
    label: "投稿されたアイデア",
    emoji: "💡",
    color: "#2D5A3D",
    bgColor: "rgba(45, 90, 61, 0.08)",
  },
  {
    icon: ThumbsUp,
    value: 45600,
    suffix: "+",
    label: "累計投票数",
    emoji: "🗳️",
    color: "#7BC67E",
    bgColor: "rgba(123, 198, 126, 0.1)",
  },
  {
    icon: Users,
    value: 3520,
    suffix: "+",
    label: "参加している発明家",
    emoji: "👧",
    color: "#F2C94C",
    bgColor: "rgba(242, 201, 76, 0.12)",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-white border-b border-[#E8E2D8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                style={{ backgroundColor: stat.bgColor }}
              >
                {stat.emoji}
              </div>
              <div
                className="text-4xl font-black tabular-nums leading-none mb-1"
                style={{ color: stat.color }}
              >
                <AnimatedCounter target={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-sm font-semibold text-[#8B6F47]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
