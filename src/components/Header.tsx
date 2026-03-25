"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  Menu,
  X,
  LogIn,
  LogOut,
  TreePine,
  Star,
  Home,
  Lightbulb,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/ideas", label: "アイデア一覧", icon: Lightbulb },
  { href: "/ranking", label: "ランキング", icon: Star },
  { href: "/forest", label: "森を見る", icon: TreePine },
];

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F3]/95 backdrop-blur-sm border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-9 h-9 bg-[#2D5A3D] rounded-xl flex items-center justify-center shadow-sm"
            >
              <Sprout size={20} className="text-white" />
            </motion.div>
            <div className="leading-tight">
              <span className="font-black text-[#2D5A3D] text-lg tracking-tight block">
                わくわくプラント
              </span>
              <span className="text-[10px] text-[#8B6F47] font-semibold -mt-0.5 block">
                こどもAI発明家
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold",
                    "transition-all duration-200",
                    isActive
                      ? "bg-[#2D5A3D] text-white shadow-sm"
                      : "text-[#3D2E1F] hover:bg-[#F0FAF0] hover:text-[#2D5A3D]"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <Link href="/ideas/new">
                  <Button
                    className="bg-[#F2C94C] text-[#3D2E1F] hover:bg-[#E8B800] rounded-xl font-bold text-sm h-9 px-4 border-0 shadow-sm"
                  >
                    <Sprout size={15} />
                    アイデアを投稿
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-[#E8E2D8]">
                  <div className="w-8 h-8 bg-[#2D5A3D] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? ""}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (session.user?.name ?? "?")[0].toUpperCase()
                    )}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-1 text-xs text-[#8B6F47] hover:text-[#3D2E1F] transition-colors font-semibold"
                  >
                    <LogOut size={13} />
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="rounded-xl font-semibold text-sm text-[#3D2E1F] hover:text-[#2D5A3D] hover:bg-[#F0FAF0]"
                  >
                    <LogIn size={15} />
                    ログイン
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#2D5A3D] text-white hover:bg-[#1E3E2A] rounded-xl font-bold text-sm h-9 border-0 shadow-sm">
                    <UserCircle size={15} />
                    新規登録
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F0FAF0] transition-colors text-[#3D2E1F]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="メニューを開く"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Botanical bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7BC67E]/40 to-transparent" />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#E8E2D8] bg-[#FAF8F3] overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold",
                      "transition-all min-h-[48px]",
                      isActive
                        ? "bg-[#2D5A3D] text-white"
                        : "text-[#3D2E1F] hover:bg-[#F0FAF0]"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-[#E8E2D8] flex flex-col gap-2">
                {session ? (
                  <>
                    <Link href="/ideas/new" onClick={() => setMobileOpen(false)}>
                      <button className="w-full flex items-center justify-center gap-2 h-12 bg-[#F2C94C] text-[#3D2E1F] rounded-xl font-bold">
                        <Sprout size={18} />
                        アイデアを投稿する
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center justify-center gap-2 h-12 text-[#8B6F47] hover:bg-[#F0FAF0] rounded-xl font-semibold"
                    >
                      <LogOut size={16} />
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <button className="w-full flex items-center justify-center gap-2 h-12 border-2 border-[#2D5A3D] text-[#2D5A3D] rounded-xl font-bold">
                        <LogIn size={18} />
                        ログイン
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <button className="w-full flex items-center justify-center gap-2 h-12 bg-[#2D5A3D] text-white rounded-xl font-bold">
                        <UserCircle size={18} />
                        新規登録（無料）
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
