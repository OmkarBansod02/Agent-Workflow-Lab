export type ToolName = "gmail" | "slack" | "crm" | "docs" | "calendar";

export type WorkflowStepType =
  | "trigger"
  | "retrieve"
  | "reason"
  | "action"
  | "approval"
  | "eval";

export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "blocked"
  | "requires_approval";

export type RiskLevel = "low" | "medium" | "high";

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  title: string;
  description: string;
  tool?: ToolName;
  status: WorkflowStatus;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
}

export interface WorkflowSummary {
  title: string;
  department: string;
  persona: string;
  riskLevel: RiskLevel;
  automationPotential: string;
  businessValue: string;
  tools: ToolName[];
  missingInfo: string[];
  assumptions: string[];
}

export type WorkspaceSourceType =
  | "email_thread"
  | "calendar_event"
  | "crm_record"
  | "slack_thread"
  | "knowledge_base_doc";

export interface WorkspaceSource {
  id: string;
  tool: ToolName;
  title: string;
  sourceType: WorkspaceSourceType;
  author: string;
  timestamp: string;
  snippet: string;
  relevanceScore: number;
  tags: string[];
}

export type TraceEventType =
  | "request_parsed"
  | "connector_search"
  | "source_retrieved"
  | "context_merged"
  | "draft_prepared"
  | "approval_gate"
  | "eval_completed";

export type TraceEventStatus = "success" | "warning" | "error";

export interface TraceEvent {
  id: string;
  stepId: string;
  type: TraceEventType;
  status: TraceEventStatus;
  title: string;
  description: string;
  tool?: ToolName;
  sources?: string[];
  timestamp: string;
}

export type DraftActionType =
  | "email_draft"
  | "crm_update_draft"
  | "slack_update_draft"
  | "calendar_event_draft";

export interface DraftAction {
  id: string;
  type: DraftActionType;
  title: string;
  targetTool: ToolName;
  body: string;
  requiresApproval: boolean;
  approvalReason: string;
  sourceIds: string[];
}

export interface EvalReport {
  retrievalScore: number;
  groundingScore: number;
  approvalScore: number;
  missingInfoScore: number;
  readinessScore: number;
  warnings: string[];
  recommendations: string[];
}

export interface DemoRun {
  request: string;
  workflowSummary: WorkflowSummary;
  workflowSteps: WorkflowStep[];
  sources: WorkspaceSource[];
  traceEvents: TraceEvent[];
  draftActions: DraftAction[];
  evalReport: EvalReport;
  rawJson: Record<string, unknown>;
}
