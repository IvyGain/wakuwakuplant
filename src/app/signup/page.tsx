"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, UserPlus, Loader2, Sprout, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const ROLES: { value: Role; label: string; emoji: string; description: string }[] = [
  { value: "CHILD", label: "子ども", emoji: "👧", description: "アイデアを考える発明家！" },
  { value: "PARENT", label: "保護者", emoji: "👨‍👩‍👧", description: "子どものアイデアを応援" },
  { value: "GENERAL", label: "一般", emoji: "🙋", description: "みんなのアイデアに投票" },
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("CHILD");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isPasswordStrong = password.length >= 8;
  const isValid =
    name.trim() &&
    email.trim() &&
    password &&
    passwordsMatch &&
    isPasswordStrong &&
    acceptTerms;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nickname: nickname || name, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "登録に失敗しました");
      }

      toast.success("アカウントを作成しました！🌱", {
        description: "ようこそ、わくわくプラントへ！",
      });
      router.push("/login");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4 py-12">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["🌰", "🌱", "🌳", "🌸", "🍎", "🌿"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-8"
            style={{
              right: `${5 + i * 16}%`,
              top: `${8 + (i % 4) * 22}%`,
            }}
            animate={{ y: [0, -10, 0], rotate: [3, -3, 3] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#F2C94C] via-[#7BC67E] to-[#2D5A3D]" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F2C94C] rounded-2xl mb-4 shadow-md">
                <Sprout size={28} className="text-[#3D2E1F]" />
              </div>
              <h1 className="text-2xl font-black text-[#1A2E1A]">
                発明家になろう！
              </h1>
              <p className="text-[#8B6F47] text-sm mt-1">
                無料でアカウントを作成する
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3D2E1F] mb-1.5">
                    名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="山田 太郎"
                    required
                    className="w-full h-11 px-3.5 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-xl text-[#3D2E1F] text-sm placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D2E1F] mb-1.5">
                    ニックネーム
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="たろう"
                    className="w-full h-11 px-3.5 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-xl text-[#3D2E1F] text-sm placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#3D2E1F] mb-1.5">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  required
                  className="w-full h-11 px-3.5 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-xl text-[#3D2E1F] text-sm placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#3D2E1F] mb-1.5">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8文字以上"
                    required
                    className="w-full h-11 px-3.5 pr-11 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-xl text-[#3D2E1F] text-sm placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F47]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && !isPasswordStrong && (
                  <p className="text-xs text-orange-500 mt-1 font-medium">
                    パスワードは8文字以上にしてください
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-bold text-[#3D2E1F] mb-1.5">
                  パスワード確認 <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="同じパスワードを入力"
                  required
                  className={cn(
                    "w-full h-11 px-3.5 bg-[#F7F5F0] border-2 rounded-xl text-[#3D2E1F] text-sm placeholder:text-[#C0B0A0] focus:outline-none focus:bg-white transition-all",
                    confirmPassword && !passwordsMatch
                      ? "border-red-400 focus:border-red-400"
                      : confirmPassword && passwordsMatch
                      ? "border-[#7BC67E] focus:border-[#7BC67E]"
                      : "border-[#E8E2D8] focus:border-[#7BC67E]"
                  )}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    パスワードが一致しません
                  </p>
                )}
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-[#3D2E1F] mb-2">
                  あなたは？ <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <motion.button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center transition-all",
                        role === r.value
                          ? "border-[#2D5A3D] bg-[#2D5A3D]/8"
                          : "border-[#E8E2D8] hover:border-[#7BC67E]"
                      )}
                    >
                      <span className="text-2xl">{r.emoji}</span>
                      <span className="text-xs font-bold text-[#3D2E1F]">{r.label}</span>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-[#8B6F47] mt-1.5 text-center">
                  {ROLES.find((r_) => r_.value === role)?.description}
                </p>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                    acceptTerms
                      ? "bg-[#2D5A3D] border-[#2D5A3D]"
                      : "border-[#E8E2D8]"
                  )}
                >
                  {acceptTerms && <Check size={12} className="text-white" />}
                </div>
                <span className="text-xs text-[#8B6F47] leading-relaxed">
                  <Link href="#" className="text-[#5B9BD5] hover:underline font-semibold">利用規約</Link>
                  {" "}および{" "}
                  <Link href="#" className="text-[#5B9BD5] hover:underline font-semibold">プライバシーポリシー</Link>
                  に同意します
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-12 bg-[#F2C94C] text-[#3D2E1F] rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#E8B800] disabled:opacity-50 transition-all shadow-md"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <UserPlus size={18} />
                )}
                {loading ? "登録中..." : "発明家として登録する！"}
              </button>
            </form>

            <p className="text-center text-sm text-[#8B6F47] mt-5">
              すでにアカウントをお持ちの方は{" "}
              <Link href="/login" className="text-[#2D5A3D] font-black hover:underline">
                ログイン
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#8B6F47] mt-4">
          🌰 あなたのアイデアで世界を変えよう！
        </p>
      </motion.div>
    </div>
  );
}
