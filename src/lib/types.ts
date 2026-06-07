export type ToolName = "gmail" | "slack" | "crm" | "docs" | "calendar";

export type ConnectorType = ToolName;

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
  label: string;
  description: string;
  tool?: ToolName;
  connector: ConnectorType;
  status: WorkflowStatus;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  durationMs: number;
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

export interface WorkflowSummaryData extends WorkflowSummary {
  stepsCount: number;
  sourcesFound: number;
  actionsGenerated: number;
  totalDurationMs: number;
  connectors: ConnectorType[];
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
  connector: ConnectorType;
  title: string;
  sourceType: WorkspaceSourceType;
  author: string;
  timestamp: string;
  snippet: string;
  summary: string;
  content: string;
  relevanceScore: number;
  relevance: number;
  tags: string[];
  metadata: Record<string, string>;
}

export type TraceEventType =
  | "request_parsed"
  | "connector_search"
  | "source_retrieved"
  | "context_merged"
  | "draft_prepared"
  | "approval_gate"
  | "eval_completed"
  | "search"
  | "retrieve"
  | "analyze"
  | "draft"
  | "eval"
  | "compile";

export type TraceEventStatus = "success" | "warning" | "blocked";

export interface TraceEvent {
  id: string;
  stepId: string;
  type: TraceEventType;
  status: TraceEventStatus;
  title: string;
  label: string;
  description: string;
  detail: string;
  tool?: ToolName;
  connector?: ConnectorType;
  sources?: string[];
  timestamp: string;
  durationMs: number;
}

export type DraftActionType =
  | "email_draft"
  | "crm_update_draft"
  | "slack_update_draft"
  | "calendar_event_draft"
  | "email"
  | "crm"
  | "slack"
  | "calendar";

export type DraftActionStatus = "approval_required";

export interface DraftAction {
  id: string;
  type: DraftActionType;
  title: string;
  summary: string;
  targetTool: ToolName;
  recipient?: string;
  body: string;
  status: DraftActionStatus;
  requiresApproval: boolean;
  approvalReason: string;
  sourceIds: string[];
}

export type EvalCheckStatus = "pass" | "warn" | "fail";

export interface EvalCheck {
  id: string;
  label: string;
  category:
    | "retrieval"
    | "grounding"
    | "approval"
    | "missing-info"
    | "action-completeness"
    | "readiness";
  status: EvalCheckStatus;
  detail: string;
}

export interface EvalReport {
  retrievalScore: number;
  groundingScore: number;
  approvalScore: number;
  missingInfoScore: number;
  actionCompletenessScore: number;
  readinessScore: number;
  overallScore: number;
  readiness: "ready" | "needs-review" | "blocked";
  summary: string;
  checks: EvalCheck[];
  warnings: string[];
  recommendations: string[];
}

export interface DemoRun {
  request: string;
  workflowSummary: WorkflowSummaryData;
  workflowSteps: WorkflowStep[];
  steps: WorkflowStep[];
  sources: WorkspaceSource[];
  traceEvents: TraceEvent[];
  trace: TraceEvent[];
  draftActions: DraftAction[];
  actions: DraftAction[];
  evalReport: EvalReport;
  eval: EvalReport;
  rawJson: Record<string, unknown>;
}

export type DemoWorkspaceData = DemoRun;
