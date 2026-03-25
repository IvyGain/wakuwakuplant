"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { IdeaStage } from "@/types";

interface PlantStageProps {
  stage: IdeaStage;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
  showLabel?: boolean;
}

const STAGE_CONFIG = {
  SEED: {
    label: "種",
    color: "#8B6F47",
    bgColor: "rgba(139, 111, 71, 0.12)",
    render: (size: number) => (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Soil */}
        <ellipse cx="32" cy="54" rx="20" ry="6" fill="#5C4033" opacity="0.3" />
        {/* Seed */}
        <ellipse cx="32" cy="42" rx="12" ry="10" fill="#8B6F47" />
        <ellipse cx="32" cy="42" rx="9" ry="7" fill="#A68B5B" />
        <path d="M28 38 Q32 32 36 38" stroke="#6B5030" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Shine */}
        <ellipse cx="27" cy="38" rx="3" ry="2" fill="white" opacity="0.3" transform="rotate(-20 27 38)" />
      </svg>
    ),
  },
  SPROUT: {
    label: "芽",
    color: "#7BC67E",
    bgColor: "rgba(123, 198, 126, 0.12)",
    render: (size: number) => (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Soil */}
        <ellipse cx="32" cy="56" rx="18" ry="5" fill="#5C4033" opacity="0.35" />
        {/* Stem */}
        <path d="M32 56 Q31 48 32 38" stroke="#5A9B5E" strokeWidth="3" strokeLinecap="round" />
        {/* Left leaf */}
        <path d="M32 46 Q22 40 20 30 Q28 32 32 42" fill="#7BC67E" opacity="0.9" />
        {/* Right leaf */}
        <path d="M32 42 Q42 36 44 26 Q36 28 32 38" fill="#5EAD62" opacity="0.85" />
        {/* Tip */}
        <circle cx="32" cy="36" r="4" fill="#A8D8AB" />
        <path d="M32 36 Q31 28 32 22" stroke="#7BC67E" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="32" cy="20" rx="5" ry="7" fill="#7BC67E" transform="rotate(10 32 20)" />
      </svg>
    ),
  },
  TREE: {
    label: "木",
    color: "#2D5A3D",
    bgColor: "rgba(45, 90, 61, 0.12)",
    render: (size: number) => (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Trunk */}
        <rect x="28" y="44" width="8" height="14" rx="2" fill="#6B4226" />
        {/* Ground */}
        <ellipse cx="32" cy="58" rx="16" ry="4" fill="#5C4033" opacity="0.3" />
        {/* Bottom canopy */}
        <ellipse cx="32" cy="42" rx="22" ry="10" fill="#2D5A3D" />
        {/* Middle canopy */}
        <ellipse cx="32" cy="30" rx="18" ry="10" fill="#3D7A52" />
        {/* Top canopy */}
        <ellipse cx="32" cy="20" rx="13" ry="9" fill="#4D9065" />
        {/* Highlight spots */}
        <circle cx="24" cy="26" r="3" fill="#5EAD62" opacity="0.4" />
        <circle cx="38" cy="22" r="2.5" fill="#5EAD62" opacity="0.35" />
        <circle cx="30" cy="16" r="2" fill="#7BC67E" opacity="0.5" />
      </svg>
    ),
  },
  FLOWER: {
    label: "花",
    color: "#E8A0BF",
    bgColor: "rgba(232, 160, 191, 0.12)",
    render: (size: number) => (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Stem */}
        <path d="M32 56 Q30 46 32 38" stroke="#5A9B5E" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M32 48 Q22 44 20 36 Q28 38 32 46" fill="#7BC67E" opacity="0.8" />
        <path d="M32 44 Q42 40 44 32 Q36 34 32 42" fill="#5EAD62" opacity="0.75" />
        {/* Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx={32 + Math.cos((angle * Math.PI) / 180) * 10}
            cy={26 + Math.sin((angle * Math.PI) / 180) * 10}
            rx="6"
            ry="9"
            fill="#E8A0BF"
            opacity="0.85"
            transform={`rotate(${angle} ${32 + Math.cos((angle * Math.PI) / 180) * 10} ${26 + Math.sin((angle * Math.PI) / 180) * 10})`}
          />
        ))}
        {/* Center */}
        <circle cx="32" cy="26" r="8" fill="#F2C94C" />
        <circle cx="32" cy="26" r="5" fill="#E8B800" />
        <circle cx="29" cy="24" r="1.5" fill="#F2C94C" opacity="0.6" />
      </svg>
    ),
  },
  FRUIT: {
    label: "実",
    color: "#F2C94C",
    bgColor: "rgba(242, 201, 76, 0.12)",
    render: (size: number) => (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Branch */}
        <path d="M32 14 Q28 20 32 28" stroke="#6B4226" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 14 Q20 10 16 18" stroke="#5A9B5E" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <ellipse cx="16" cy="17" rx="8" ry="5" fill="#5EAD62" transform="rotate(-20 16 17)" />
        <ellipse cx="26" cy="12" rx="6" ry="4" fill="#7BC67E" transform="rotate(15 26 12)" />
        {/* Apple */}
        <path d="M20 34 Q18 22 32 20 Q46 22 44 34 Q46 48 32 50 Q18 48 20 34Z" fill="#E8504A" />
        {/* Shine */}
        <ellipse cx="25" cy="28" rx="5" ry="7" fill="white" opacity="0.2" transform="rotate(-15 25 28)" />
        {/* Yellow glow */}
        <circle cx="42" cy="22" r="8" fill="#F2C94C" opacity="0.7" />
        <circle cx="42" cy="22" r="5" fill="#F2C94C" />
        <circle cx="40" cy="20" r="2" fill="white" opacity="0.3" />
        {/* Stem */}
        <path d="M32 20 Q33 14 34 12" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

const SIZE_MAP = {
  xs: 32,
  sm: 48,
  md: 64,
  lg: 96,
  xl: 128,
};

export function PlantStage({
  stage,
  size = "md",
  animated = true,
  className,
  showLabel = false,
}: PlantStageProps) {
  const config = STAGE_CONFIG[stage];
  const pixelSize = SIZE_MAP[size];

  const content = (
    <div
      className={cn("flex flex-col items-center gap-1", className)}
      style={{ color: config.color }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: pixelSize + 16,
          height: pixelSize + 16,
          backgroundColor: config.bgColor,
        }}
      >
        {config.render(pixelSize)}
      </div>
      {showLabel && (
        <span
          className="text-xs font-bold"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
      )}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      className={cn("flex flex-col items-center gap-1", className)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      style={{ color: config.color }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full"
        style={{
          width: pixelSize + 16,
          height: pixelSize + 16,
          backgroundColor: config.bgColor,
        }}
        animate={
          stage === "FLOWER"
            ? { rotate: [0, -3, 3, -3, 0] }
            : stage === "FRUIT"
            ? { y: [0, -3, 0] }
            : stage === "TREE"
            ? { scale: [1, 1.02, 1] }
            : {}
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {config.render(pixelSize)}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-bold" style={{ color: config.color }}>
          {config.label}
        </span>
      )}
    </motion.div>
  );
}

export { STAGE_CONFIG };
