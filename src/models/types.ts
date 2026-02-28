// ============================================================================
// Chat & Session Types
// ============================================================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type SessionStatus = "active" | "completed" | "abandoned";

export interface RecoverySession {
  id: string;
  protocolId: string | null;
  messages: ChatMessage[];
  moodBefore: number | null; // 1-10
  moodAfter: number | null; // 1-10
  plan: string | null;
  followUpScheduledAt: string | null;
  followUpResult: FollowUpResult | null;
  createdAt: string;
  updatedAt: string;
  status: SessionStatus;
}

export interface FollowUpResult {
  didFollowThrough: boolean;
  feelingAfter: number | null; // 1-10
  notes: string;
  completedAt: string;
}

// ============================================================================
// Protocol Types
// ============================================================================

export type ProtocolCategory =
  | "decision"
  | "overwhelm"
  | "motivation"
  | "self-inquiry"
  | "focusing";

export interface ProtocolStep {
  id: string;
  instruction: string;
  type: "prompt" | "reflection" | "action" | "check-in";
  repeatCount?: number;
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  category: ProtocolCategory;
  steps: ProtocolStep[];
  systemPromptAddition: string;
}

// ============================================================================
// Diagnostic Model Types (Dalio-style pattern analysis)
// ============================================================================

export interface DiagnosticInsight {
  id: string;
  pattern: string; // The recurring pattern identified
  frequency: number; // How many times observed
  rootCause: string; // Diagnosed root cause
  suggestedFix: string; // Systemic fix suggestion
  sessions: string[]; // Session IDs where this appeared
  firstSeen: string;
  lastSeen: string;
}

export interface DiagnosticReport {
  id: string;
  generatedAt: string;
  insights: DiagnosticInsight[];
  summary: string;
  topRecommendations: string[];
}

// ============================================================================
// Trust Economy Types
// ============================================================================

export interface TrustMetrics {
  date: string; // YYYY-MM-DD
  promisesMade: number;
  promisesKept: number;
  interventionsTried: number;
  interventionsWorked: number;
}

// ============================================================================
// Task Dump Types
// ============================================================================

export interface TaskItem {
  id: string;
  text: string;
  category: string;
  originalIndex: number; // Position in the original dump
}

export interface TaskCategory {
  name: string;
  tasks: TaskItem[];
}

export interface TaskDumpResult {
  id: string;
  rawInput: string;
  categories: TaskCategory[];
  createdAt: string;
  approved: boolean;
}

// ============================================================================
// Reward / Currency Types
// ============================================================================

export interface RewardEvent {
  id: string;
  type: "session_complete" | "follow_through" | "streak" | "experiment";
  amount: number;
  description: string;
  timestamp: string;
}

// ============================================================================
// AI Types
// ============================================================================

export type AIProvider = "gemini" | "openrouter";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIConfig {
  geminiApiKey: string;
  openRouterApiKey: string;
  primaryProvider: AIProvider;
  geminiModel: string;
  openRouterModel: string;
}
