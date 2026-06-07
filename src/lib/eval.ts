import type { CompiledWorkflow } from "./compiler-schema";
import type {
  DraftAction,
  EvalCheck,
  EvalReport,
  ToolName,
  WorkspaceSource,
} from "./types";

interface EvaluateRunInput {
  request: string;
  sources: WorkspaceSource[];
  draftActions: DraftAction[];
  compiledWorkflow?: CompiledWorkflow;
}

const REQUIRED_TOOLS: ToolName[] = ["gmail", "calendar", "crm", "slack", "docs"];
const REQUIRED_DRAFT_TOOLS: ToolName[] = ["gmail", "crm", "slack", "calendar"];

export function evaluateRun(input: EvaluateRunInput): EvalReport {
  if (input.compiledWorkflow) {
    return evaluateCompiledWorkflowRun(input);
  }

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

function evaluateCompiledWorkflowRun(input: EvaluateRunInput): EvalReport {
  const workflow = input.compiledWorkflow;

  if (!workflow) {
    return evaluateRun({
      request: input.request,
      sources: input.sources,
      draftActions: input.draftActions,
    });
  }

  const retrievedTools = new Set(input.sources.map((source) => source.tool));
  const expectedTools = workflow.tools.length > 0 ? workflow.tools : REQUIRED_TOOLS;
  const sourceCoverageRatio =
    expectedTools.filter((tool) => retrievedTools.has(tool)).length /
    expectedTools.length;
  const allExpectedToolsRetrieved = sourceCoverageRatio === 1;
  const allActionsNeedApproval = input.draftActions.every(
    (action) => action.requiresApproval,
  );
  const draftTools = new Set(input.draftActions.map((action) => action.targetTool));
  const allDraftActionsPresent = REQUIRED_DRAFT_TOOLS.every((tool) =>
    draftTools.has(tool),
  );
  const approvalGateTools = new Set(
    workflow.approvalGates.flatMap((gate) => gate.requiredForTools),
  );
  const approvalGatesCoverActions = REQUIRED_DRAFT_TOOLS.every((tool) =>
    approvalGateTools.has(tool),
  );
  const workflowText = [
    input.request,
    workflow.title,
    workflow.intent,
    ...workflow.steps.flatMap((step) => [
      step.title,
      step.description ?? "",
      step.goal,
    ]),
  ].join(" ");
  const needsSoc2Grounding = /\b(soc\s*2|soc2|security|nda)\b/i.test(
    workflowText,
  );
  const needsPricingGrounding = /\b(pricing|price|discount|quote|arr|finance)\b/i.test(
    workflowText,
  );
  const hasSoc2Grounding =
    !needsSoc2Grounding ||
    input.sources.some(
      (source) =>
        isGroundingTool(source.tool) &&
        /\b(soc2|security|nda)\b/i.test(sourceGroundingText(source)),
    );
  const hasPricingGrounding =
    !needsPricingGrounding ||
    input.sources.some(
      (source) =>
        isGroundingTool(source.tool) &&
        /\b(pricing|price|discount|quote|48k|arr|finance)\b/i.test(
          sourceGroundingText(source),
        ),
    );

  const retrievalScore = Math.round(60 + sourceCoverageRatio * 36);
  const groundingScore =
    hasSoc2Grounding && hasPricingGrounding
      ? 94
      : hasSoc2Grounding || hasPricingGrounding
        ? 76
        : 58;
  const approvalScore =
    allActionsNeedApproval && approvalGatesCoverActions
      ? 100
      : allActionsNeedApproval
        ? 82
        : 40;
  const missingInfoScore = Math.max(55, 96 - workflow.missingInfo.length * 8);
  const actionCompletenessScore = allDraftActionsPresent ? 96 : 65;
  const readinessScore = Math.round(
    (retrievalScore +
      groundingScore +
      approvalScore +
      missingInfoScore +
      actionCompletenessScore) /
      5,
  );
  const overallScore = readinessScore;
  const approvalGateDetail =
    workflow.approvalGates.length > 0
      ? workflow.approvalGates
          .map(
            (gate) =>
              `${gate.title}: ${gate.requiredForTools.join(", ")} approval required`,
          )
          .join("; ")
      : "No compiled approval gates were provided.";
  const missingInfoWarnings = workflow.missingInfo.map(
    (item) => `Missing info from compiled workflow: ${item}`,
  );
  const warnings = [
    ...missingInfoWarnings,
    ...(hasSoc2Grounding
      ? []
      : [
          "SOC2 or security claims need grounding in retrieved Docs, Gmail, or CRM sources.",
        ]),
    ...(hasPricingGrounding
      ? []
      : [
          "Pricing claims need grounding in retrieved Docs, Gmail, or CRM sources.",
        ]),
    "Approval required before any external customer communication or workspace draft is used.",
  ];
  const recommendations = [
    "Route the customer email draft through the AE and security owner before sharing externally.",
    "Confirm every compiled approval gate before using Gmail, CRM, Slack, or calendar drafts.",
    "Resolve missing information before approving customer-facing SOC2, pricing, or scheduling language.",
    "Keep CRM, Slack, email, and calendar outputs in draft state until a reviewer approves the run.",
  ];
  const checks: EvalCheck[] = [
    {
      id: "eval-retrieval",
      label: "Compiled source coverage",
      category: "retrieval",
      status: allExpectedToolsRetrieved ? "pass" : "warn",
      detail: `Retrieved seeded sources for ${Array.from(retrievedTools).join(", ") || "none"}; compiled plan expected ${expectedTools.join(", ")}.`,
    },
    {
      id: "eval-grounding",
      label: "SOC2 and pricing grounding",
      category: "grounding",
      status: hasSoc2Grounding && hasPricingGrounding ? "pass" : "warn",
      detail:
        "SOC2, security, and pricing claims were checked against retrieved Docs, Gmail, and CRM sources.",
    },
    {
      id: "eval-approval",
      label: "Compiled approval gates",
      category: "approval",
      status:
        allActionsNeedApproval && approvalGatesCoverActions ? "pass" : "warn",
      detail: approvalGateDetail,
    },
    {
      id: "eval-missing-info",
      label: "Missing information",
      category: "missing-info",
      status: workflow.missingInfo.length === 0 ? "pass" : "warn",
      detail:
        workflow.missingInfo.length === 0
          ? "The compiled workflow did not list unresolved missing information."
          : workflow.missingInfo.join("; "),
    },
    {
      id: "eval-readiness",
      label: "Review readiness",
      category: "readiness",
      status: readinessScore >= 85 && allDraftActionsPresent ? "pass" : "warn",
      detail: allDraftActionsPresent
        ? "All four required drafts are prepared and approval-gated for review."
        : "One or more required draft action types are missing.",
    },
  ];

  return {
    retrievalScore,
    groundingScore,
    approvalScore,
    missingInfoScore,
    readinessScore,
    overallScore,
    readiness: readinessScore >= 75 ? "needs-review" : "blocked",
    summary:
      "The compiled workflow plan was used to retrieve seeded sources, prepare approval-gated drafts, and evaluate grounding, missing information, and review readiness.",
    checks,
    warnings,
    recommendations,
  };
}

function isGroundingTool(tool: ToolName): boolean {
  return tool === "docs" || tool === "gmail" || tool === "crm";
}

function sourceGroundingText(source: WorkspaceSource): string {
  return [
    source.title,
    source.snippet,
    source.summary,
    source.content,
    source.tags.join(" "),
  ].join(" ");
}
