import Link from "next/link";
import { Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A2E1A] text-[#A0B8A0] mt-auto">
      {/* Botanical wave top */}
      <div className="w-full overflow-hidden leading-none" style={{ height: 40 }}>
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="#FAF8F3"
        >
          <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,15 1440,10 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-[#2D5A3D] rounded-xl flex items-center justify-center">
                <Sprout size={20} className="text-[#7BC67E]" />
              </div>
              <div>
                <span className="font-black text-white text-lg block">
                  わくわくプラント
                </span>
                <span className="text-[10px] text-[#7BC67E] font-semibold">
                  こどもAI発明家
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              子どもたちのアイデアの種をみんなで育てよう。
              AIの力で、子どもたちの夢を現実に。
            </p>
            <div className="flex gap-2 mt-4">
              {["🌰", "🌱", "🌳", "🌸", "🍎"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-[#2D5A3D] rounded-full flex items-center justify-center text-base"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-3 text-sm">サービス</h3>
            <ul className="space-y-2">
              {[
                { href: "/ideas", label: "アイデア一覧" },
                { href: "/ranking", label: "ランキング" },
                { href: "/forest", label: "森を見る" },
                { href: "/ideas/new", label: "アイデアを投稿" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm hover:text-[#7BC67E] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-3 text-sm">サポート</h3>
            <ul className="space-y-2">
              {[
                { href: "#", label: "使い方ガイド" },
                { href: "#", label: "よくある質問" },
                { href: "#", label: "プライバシーポリシー" },
                { href: "#", label: "利用規約" },
                { href: "#", label: "お問い合わせ" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-[#7BC67E] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-[#2D5A3D] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            &copy; 2026 わくわくプラント. All rights reserved.
          </p>
          <p className="text-xs text-[#7BC67E]">
            🌱 子どもたちの未来のために作られました
          </p>
        </div>
      </div>
    </footer>
  );
}
