"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LogIn, Loader2, Sprout } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleCredentialLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("メールアドレスまたはパスワードが正しくありません");
      } else {
        toast.success("ログインしました！");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      toast.error("Googleログインに失敗しました");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4 py-12">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["🌱", "🍃", "🌸", "🌿", "🌻", "🍀"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-10"
            style={{
              left: `${5 + i * 18}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
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
          {/* Top bar */}
          <div className="h-2 bg-gradient-to-r from-[#7BC67E] via-[#2D5A3D] to-[#F2C94C]" />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2D5A3D] rounded-2xl mb-4 shadow-md">
                <Sprout size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-[#1A2E1A]">おかえり！</h1>
              <p className="text-[#8B6F47] text-sm mt-1">
                アカウントにログインしてください
              </p>
            </div>

            {/* Google login */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full h-12 flex items-center justify-center gap-3 border-2 border-[#E8E2D8] rounded-2xl font-bold text-[#3D2E1F] hover:border-[#7BC67E] hover:bg-[#F0FAF0] transition-all disabled:opacity-60 mb-5"
            >
              {googleLoading ? (
                <Loader2 size={18} className="animate-spin text-[#7BC67E]" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
              )}
              Googleでログイン
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#E8E2D8]" />
              <span className="text-xs font-semibold text-[#C0B0A0]">または</span>
              <div className="flex-1 h-px bg-[#E8E2D8]" />
            </div>

            {/* Email login form */}
            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#3D2E1F] mb-1.5">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  required
                  className="w-full h-12 px-4 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-2xl text-[#3D2E1F] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#3D2E1F] mb-1.5">
                  パスワード
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 px-4 pr-12 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-2xl text-[#3D2E1F] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F47] hover:text-[#3D2E1F] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-xs font-semibold text-[#5B9BD5] hover:underline"
                >
                  パスワードを忘れた方
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-12 bg-[#2D5A3D] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#1E3E2A] disabled:opacity-50 transition-all shadow-md shadow-[#2D5A3D]/20"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <LogIn size={18} />
                )}
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </form>

            {/* Signup link */}
            <p className="text-center text-sm text-[#8B6F47] mt-6">
              まだアカウントをお持ちでない方は{" "}
              <Link
                href="/signup"
                className="text-[#2D5A3D] font-black hover:underline"
              >
                新規登録
              </Link>
            </p>
          </div>
        </div>

        {/* Motivational text */}
        <p className="text-center text-sm text-[#8B6F47] mt-4">
          🌱 ログインしてアイデアに投票しよう！
        </p>
      </motion.div>
    </div>
  );
}
