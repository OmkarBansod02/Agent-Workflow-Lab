export type ConnectorType = "gmail" | "calendar" | "crm" | "slack" | "docs";

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  status: "completed" | "running" | "pending" | "error";
  connector: ConnectorType;
  durationMs: number;
}

export interface WorkspaceSource {
  id: string;
  connector: ConnectorType;
  title: string;
  summary: string;
  timestamp: string;
  relevance: number;
  metadata: Record<string, string>;
}

export interface TraceEvent {
  id: string;
  timestamp: string;
  type: "search" | "retrieve" | "analyze" | "draft" | "eval" | "compile";
  label: string;
  detail: string;
  durationMs: number;
  status: "success" | "warning" | "error";
}

export interface DraftAction {
  id: string;
  type: "email" | "crm" | "slack" | "calendar";
  title: string;
  summary: string;
  body: string;
  status: "draft" | "approved" | "rejected";
  recipient?: string;
  metadata: Record<string, string>;
}

export interface EvalCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  category: "accuracy" | "safety" | "completeness" | "tone" | "compliance";
}

export interface EvalReport {
  overallScore: number;
  readiness: "ready" | "needs-review" | "blocked";
  checks: EvalCheck[];
  summary: string;
}

export interface WorkflowSummaryData {
  request: string;
  stepsCount: number;
  sourcesFound: number;
  actionsGenerated: number;
  totalDurationMs: number;
  connectors: ConnectorType[];
}

export interface DemoWorkspaceData {
  workflowSummary: WorkflowSummaryData;
  steps: WorkflowStep[];
  sources: WorkspaceSource[];
  trace: TraceEvent[];
  actions: DraftAction[];
  eval: EvalReport;
}
