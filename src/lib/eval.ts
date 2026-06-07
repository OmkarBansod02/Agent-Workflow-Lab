import type { DraftAction, EvalCheck, EvalReport, ToolName, WorkspaceSource } from "./types";

interface EvaluateRunInput {
  request: string;
  sources: WorkspaceSource[];
  draftActions: DraftAction[];
}

const REQUIRED_TOOLS: ToolName[] = ["gmail", "calendar", "crm", "slack", "docs"];

export function evaluateRun(input: EvaluateRunInput): EvalReport {
  const retrievedTools = new Set(input.sources.map((source) => source.tool));
  const allToolsRetrieved = REQUIRED_TOOLS.every((tool) => retrievedTools.has(tool));
  const allActionsNeedApproval = input.draftActions.every(
    (action) => action.requiresApproval,
  );
  const hasSoc2Source = input.sources.some((source) => source.tags.includes("soc2"));
  const hasPricingSource = input.sources.some((source) =>
    source.tags.includes("pricing"),
  );
  const hasExactFollowUpDate = /\b2026-06-(0[89]|1[0-9]|2[0-9]|30)\b/.test(
    input.request,
  );

  const retrievalScore = allToolsRetrieved ? 96 : Math.max(60, retrievedTools.size * 18);
  const groundingScore = hasSoc2Source && hasPricingSource ? 92 : 76;
  const approvalScore = allActionsNeedApproval ? 100 : 40;
  const missingInfoScore = hasExactFollowUpDate ? 92 : 78;
  const readinessScore = Math.round(
    (retrievalScore + groundingScore + approvalScore + missingInfoScore) / 4,
  );
  const overallScore = readinessScore;

  const warnings = [
    "Missing exact follow-up date; the calendar item remains a prepared draft until the customer confirms availability.",
    "Approval required before any external customer communication is used.",
    "Security and SOC2 claims need grounding in the SOC2 one-pager and NDA status.",
    "Pricing claims need source grounding and approval before customer-facing proposal language.",
  ];

  const recommendations = [
    "Route the customer email draft through the AE and security owner before sharing externally.",
    "Confirm NDA status before attaching or referencing the full SOC2 Type II report.",
    "Confirm finance approval before including discount or concession language.",
    "Keep CRM, Slack, email, and calendar outputs in draft state until a reviewer approves the run.",
  ];

  const checks: EvalCheck[] = [
    {
      id: "eval-retrieval",
      label: "Seeded source retrieval",
      category: "retrieval",
      status: allToolsRetrieved ? "pass" : "warn",
      detail: allToolsRetrieved
        ? "Retrieved relevant seeded sources across Gmail, Calendar, CRM, Slack, and Docs."
        : "One or more expected seeded connectors did not return relevant context.",
    },
    {
      id: "eval-grounding",
      label: "Security and pricing grounding",
      category: "grounding",
      status: hasSoc2Source && hasPricingSource ? "pass" : "warn",
      detail:
        "SOC2 and pricing language should stay tied to the retrieved security one-pager, pricing FAQ, CRM, and Slack guidance.",
    },
    {
      id: "eval-approval",
      label: "Approval gate",
      category: "approval",
      status: allActionsNeedApproval ? "pass" : "fail",
      detail:
        "Every prepared action requires approval before email, CRM, Slack, or calendar work can move forward.",
    },
    {
      id: "eval-missing-follow-up-date",
      label: "Exact follow-up date",
      category: "missing-info",
      status: hasExactFollowUpDate ? "pass" : "warn",
      detail:
        "The request asks for a follow-up, but no exact customer-confirmed follow-up date is available.",
    },
    {
      id: "eval-readiness",
      label: "Review readiness",
      category: "readiness",
      status: readinessScore >= 85 ? "pass" : "warn",
      detail:
        "The run is ready for human review because outputs are drafted and approval-gated, with unresolved details called out.",
    },
  ];

  return {
    retrievalScore,
    groundingScore,
    approvalScore,
    missingInfoScore,
    readinessScore,
    overallScore,
    readiness: readinessScore >= 85 ? "needs-review" : "blocked",
    summary:
      "The deterministic run retrieved seeded workplace context, prepared approval-gated drafts, and flagged security, pricing, and scheduling review needs.",
    checks,
    warnings,
    recommendations,
  };
}
