import Link from "next/link";
import { Sprout, ArrowRight, Star, Users, Lightbulb } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedIdeas } from "@/components/home/FeaturedIdeas";
import { StatsSection } from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturedIdeas />

      {/* CTA section */}
      <section className="py-20 bg-[#2D5A3D] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#3D7A52]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#1A2E1A]/40 rounded-full blur-3xl" />
          {["🌱", "🌿", "🍃", "🌾", "🌻"].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-15 animate-float"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#7BC67E]/20 text-[#7BC67E] rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Sprout size={16} />
            あなたのアイデアを待っています
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            今すぐ種をまこう！
          </h2>
          <p className="text-[#A0C8A8] text-lg mb-10 max-w-2xl mx-auto">
            あなたのアイデアがみんなの投票で育ち、
            実現するかもしれません。
            まずは気軽に投稿してみましょう！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ideas/new"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-[#F2C94C] text-[#3D2E1F] rounded-2xl font-black text-lg shadow-lg hover:bg-[#E8B800] transition-colors"
            >
              <Sprout size={22} />
              アイデアを投稿する
            </Link>
            <Link
              href="/ideas"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-white/10 text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              みんなのアイデアを見る
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
