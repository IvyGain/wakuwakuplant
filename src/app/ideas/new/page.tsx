"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import {
  Sprout,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Loader2,
  Eye,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { PlantStage } from "@/components/PlantStage";
import {
  type IdeaCategory,
  CATEGORY_OPTIONS,
} from "@/types";
import { cn } from "@/lib/utils";

const MAX_TITLE = 80;
const MAX_DESC = 1000;

export default function NewIdeaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IdeaCategory | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3]">
        <Loader2 size={40} className="text-[#7BC67E] animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-[#E8E2D8] p-10 text-center max-w-md shadow-sm"
        >
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-black text-[#1A2E1A] mb-3">
            ログインが必要です
          </h2>
          <p className="text-[#8B6F47] mb-6">
            アイデアを投稿するにはログインしてください。
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center h-12 bg-[#2D5A3D] text-white rounded-2xl font-bold"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center h-12 border-2 border-[#2D5A3D] text-[#2D5A3D] rounded-2xl font-bold"
            >
              新規登録（無料）
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || !category) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), category }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "投稿に失敗しました");
      }

      const data = await res.json();
      toast.success("アイデアを投稿しました！🌱", {
        description: "みんなの投票で育てていきましょう！",
      });
      router.push(`/ideas/${data.idea?.id ?? data.id}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.type.startsWith("image/")).slice(0, 3);
    setImages((prev) => [...prev, ...valid].slice(0, 3));
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  }

  const isStep1Valid = title.trim().length >= 5 && title.trim().length <= MAX_TITLE;
  const isStep2Valid = description.trim().length >= 20 && description.trim().length <= MAX_DESC;
  const isStep3Valid = category !== "";

  const STEPS = [
    { num: 1, label: "タイトル", valid: isStep1Valid },
    { num: 2, label: "説明", valid: isStep2Valid },
    { num: 3, label: "カテゴリ", valid: isStep3Valid },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#2D5A3D] font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          アイデア一覧に戻る
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2D5A3D] rounded-2xl mb-4 shadow-lg">
            <Sprout size={32} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A2E1A] mb-2">
            アイデアの種をまこう
          </h1>
          <p className="text-[#8B6F47]">あなたのAIアイデアをみんなと共有しましょう！</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <motion.button
                onClick={() => {
                  if (s.num < step || (s.num === step + 1 && STEPS[step - 1].valid)) {
                    setStep(s.num as 1 | 2 | 3);
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-bold transition-all",
                  step === s.num
                    ? "bg-[#2D5A3D] text-white shadow-sm"
                    : s.valid
                    ? "bg-[#7BC67E]/20 text-[#2D5A3D]"
                    : "bg-[#F7F5F0] text-[#C0B0A0]"
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {s.valid && step > s.num ? (
                  <Check size={14} />
                ) : (
                  <span>{s.num}</span>
                )}
                {s.label}
              </motion.button>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-0.5 bg-[#E8E2D8]" />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#8B6F47] via-[#7BC67E] to-[#2D5A3D]" />

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Title */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <label className="block text-sm font-bold text-[#3D2E1F] mb-1">
                    アイデアのタイトル <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-[#8B6F47] mb-3">
                    短く分かりやすいタイトルをつけましょう（5〜80文字）
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={MAX_TITLE}
                      placeholder="例：AIがゴミの分別を教えてくれるアプリ"
                      className="w-full h-14 px-4 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-2xl text-[#3D2E1F] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white text-base font-medium transition-all"
                      autoFocus
                    />
                    <span
                      className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold",
                        title.length > MAX_TITLE * 0.85
                          ? "text-orange-500"
                          : "text-[#C0B0A0]"
                      )}
                    >
                      {title.length}/{MAX_TITLE}
                    </span>
                  </div>

                  {/* Inspiration */}
                  <div className="mt-4 bg-[#F7F5F0] rounded-2xl p-4">
                    <p className="text-xs font-bold text-[#8B6F47] mb-2">💡 タイトルのヒント</p>
                    <ul className="space-y-1 text-xs text-[#8B6F47]">
                      <li>✅「〜するAIアプリ」「〜ができるロボット」</li>
                      <li>✅ 問題と解決策を含める</li>
                      <li>✅ 具体的でイメージしやすい表現</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Description */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <label className="block text-sm font-bold text-[#3D2E1F] mb-1">
                    アイデアの説明 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-[#8B6F47] mb-3">
                    どんなAIアイデアか詳しく教えてください（20〜1000文字）
                  </p>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={MAX_DESC}
                      placeholder="例：このアプリはスマートフォンのカメラを使って、ゴミをかざすだけでAIが自動で分別方法を教えてくれます。プラスチック、燃えるゴミ、資源ゴミなどを正確に判定し、地域ごとのルールにも対応しています。"
                      rows={8}
                      className="w-full px-4 py-3 bg-[#F7F5F0] border-2 border-[#E8E2D8] rounded-2xl text-[#3D2E1F] placeholder:text-[#C0B0A0] focus:outline-none focus:border-[#7BC67E] focus:bg-white resize-none text-base transition-all leading-relaxed"
                      autoFocus
                    />
                    <span
                      className={cn(
                        "absolute right-4 bottom-3 text-xs font-semibold",
                        description.length > MAX_DESC * 0.85
                          ? "text-orange-500"
                          : "text-[#C0B0A0]"
                      )}
                    >
                      {description.length}/{MAX_DESC}
                    </span>
                  </div>

                  {/* Image upload */}
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-[#3D2E1F] mb-2">
                      画像（任意・最大3枚）
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#E8E2D8] rounded-2xl p-6 text-center cursor-pointer hover:border-[#7BC67E] hover:bg-[#F0FAF0] transition-all"
                    >
                      <Upload size={24} className="text-[#C0B0A0] mx-auto mb-2" />
                      <p className="text-sm text-[#8B6F47] font-medium">
                        クリックして画像をアップロード
                      </p>
                      <p className="text-xs text-[#C0B0A0] mt-1">PNG, JPG, GIF 対応</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {imagePreviews.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {imagePreviews.map((src, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E8E2D8]">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => {
                                setImagePreviews((p) => p.filter((_, j) => j !== i));
                                setImages((p) => p.filter((_, j) => j !== i));
                              }}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Category + Preview */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-[#3D2E1F]">
                      カテゴリを選んでください <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={() => setPreview(!preview)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A3D] hover:underline"
                    >
                      {preview ? <Edit size={13} /> : <Eye size={13} />}
                      {preview ? "編集に戻る" : "プレビュー"}
                    </button>
                  </div>

                  {preview ? (
                    <div className="border-2 border-[#E8E2D8] rounded-2xl overflow-hidden">
                      <div className="h-1.5" style={{ backgroundColor: "#7BC67E" }} />
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <PlantStage stage="SEED" size="sm" animated={false} />
                          <div>
                            <div className="flex gap-2 mb-1.5">
                              {category && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D]">
                                  {CATEGORY_OPTIONS.find((c) => c.value === category)?.emoji}{" "}
                                  {CATEGORY_OPTIONS.find((c) => c.value === category)?.label}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-[#3D2E1F] text-base">{title || "(タイトル未入力)"}</h3>
                          </div>
                        </div>
                        <p className="text-[#8B6F47] text-sm mt-3 leading-relaxed line-clamp-4">
                          {description || "(説明未入力)"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <motion.button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all",
                            category === cat.value
                              ? "border-current text-white shadow-md"
                              : "border-[#E8E2D8] text-[#3D2E1F] hover:border-[#7BC67E] hover:bg-[#F0FAF0]"
                          )}
                          style={
                            category === cat.value
                              ? { backgroundColor: cat.color, borderColor: cat.color }
                              : {}
                          }
                        >
                          <span className="text-3xl">{cat.emoji}</span>
                          <span className="font-bold text-sm">{cat.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#E8E2D8]">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3)}
                disabled={step === 1}
                className="flex items-center gap-2 h-12 px-6 rounded-2xl font-bold text-[#8B6F47] hover:bg-[#F7F5F0] disabled:opacity-30 transition-all"
              >
                <ArrowLeft size={18} />
                戻る
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => Math.min(3, s + 1) as 1 | 2 | 3)}
                  disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                  className="flex items-center gap-2 h-12 px-8 bg-[#2D5A3D] text-white rounded-2xl font-bold disabled:opacity-40 hover:bg-[#1E3E2A] transition-all shadow-sm"
                >
                  次へ
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStep3Valid || submitting}
                  className="flex items-center gap-2 h-12 px-8 bg-[#F2C94C] text-[#3D2E1F] rounded-2xl font-black disabled:opacity-40 hover:bg-[#E8B800] transition-all shadow-sm"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Sprout size={18} />
                  )}
                  {submitting ? "投稿中..." : "アイデアを投稿する！"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-[#8B6F47]"
        >
          <p>
            🌰 あなたのアイデアが<strong className="text-[#2D5A3D]">種</strong>となり、
            みんなの投票で<strong className="text-[#7BC67E]">育ちます</strong>！
          </p>
        </motion.div>
      </div>
    </div>
  );
}
