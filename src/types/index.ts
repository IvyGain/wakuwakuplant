// ─────────────────────────────────────────────
// Enums (mirroring Prisma schema)
// ─────────────────────────────────────────────

export type Role = "CHILD" | "PARENT" | "GENERAL" | "MENTOR" | "ADMIN";

export type IdeaCategory =
  | "LIFE"
  | "SCHOOL"
  | "PLAY"
  | "HEALTH"
  | "ENVIRONMENT"
  | "OTHER";

export type IdeaStatus =
  | "DRAFT"
  | "PENDING"
  | "PUBLISHED"
  | "SELECTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type IdeaStage = "SEED" | "SPROUT" | "TREE" | "FLOWER" | "FRUIT";

export type VotingPeriodStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export type EventStatus = "UPCOMING" | "OPEN" | "CLOSED" | "COMPLETED";

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

// ─────────────────────────────────────────────
// Domain Models
// ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  nickname: string | null;
  role: Role;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  authorId: string;
  status: IdeaStatus;
  stage: IdeaStage;
  voteCount: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  author?: User;
  hasVoted?: boolean;
}

export interface Vote {
  id: string;
  userId: string;
  ideaId: string;
  createdAt: string;
}

export interface VotingPeriod {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: VotingPeriodStatus;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  ideaId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

// ─────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IdeasListResponse {
  ideas: Idea[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface StatsResponse {
  totalIdeas: number;
  totalVotes: number;
  totalParticipants: number;
}

// ─────────────────────────────────────────────
// UI / View helpers
// ─────────────────────────────────────────────

export interface CategoryOption {
  value: IdeaCategory;
  label: string;
  emoji: string;
  color: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "LIFE", label: "生活", emoji: "🏠", color: "#5B9BD5" },
  { value: "SCHOOL", label: "学校", emoji: "📚", color: "#2D5A3D" },
  { value: "PLAY", label: "遊び", emoji: "🎮", color: "#F2C94C" },
  { value: "HEALTH", label: "健康", emoji: "💚", color: "#7BC67E" },
  { value: "ENVIRONMENT", label: "環境", emoji: "🌿", color: "#2D5A3D" },
  { value: "OTHER", label: "その他", emoji: "✨", color: "#8B6F47" },
];

export const STAGE_CONFIG: Record<
  IdeaStage,
  { label: string; emoji: string; color: string; minVotes: number; maxVotes: number }
> = {
  SEED: {
    label: "種",
    emoji: "🌰",
    color: "#8B6F47",
    minVotes: 0,
    maxVotes: 9,
  },
  SPROUT: {
    label: "芽",
    emoji: "🌱",
    color: "#7BC67E",
    minVotes: 10,
    maxVotes: 49,
  },
  TREE: {
    label: "木",
    emoji: "🌳",
    color: "#2D5A3D",
    minVotes: 50,
    maxVotes: 199,
  },
  FLOWER: {
    label: "花",
    emoji: "🌸",
    color: "#E8A0BF",
    minVotes: 200,
    maxVotes: 499,
  },
  FRUIT: {
    label: "実",
    emoji: "🍎",
    color: "#F2C94C",
    minVotes: 500,
    maxVotes: Infinity,
  },
};

export function getCategoryLabel(category: IdeaCategory): string {
  return CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? category;
}

export function getCategoryEmoji(category: IdeaCategory): string {
  return CATEGORY_OPTIONS.find((c) => c.value === category)?.emoji ?? "✨";
}

export function getCategoryColor(category: IdeaCategory): string {
  return CATEGORY_OPTIONS.find((c) => c.value === category)?.color ?? "#8B6F47";
}
