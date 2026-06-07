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
  const draftTools = new Set(input.draftActions.map((action) => action.targetTool));
  const allDraftActionsPresent = REQUIRED_DRAFT_TOOLS.every((tool) =>
    draftTools.has(tool),
  );

  const retrievalScore = allToolsRetrieved ? 96 : Math.max(60, retrievedTools.size * 18);
  const groundingScore = hasSoc2Source && hasPricingSource ? 92 : 76;
  const approvalScore = allActionsNeedApproval ? 100 : 40;
  const missingInfoScore = hasExactFollowUpDate ? 92 : 78;
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

  const warnings = [
    "Pricing language requires source grounding and finance approval before it is used with the customer.",
    "SOC2 and security claims require source grounding in the SOC2 one-pager, NDA status, and approved security context.",
    "Customer-facing actions require approval before any email or calendar draft is used.",
    ...(hasExactFollowUpDate
      ? []
      : [
          "Follow-up date and time should be confirmed because the request does not include an explicit customer-approved slot.",
        ]),
  ];

  const recommendations = [
    "Confirm pricing before sending the customer email.",
    "Attach the SOC2 one-pager only after the AE or security owner approves the customer follow-up.",
    "Confirm the follow-up time with the customer before using the calendar draft.",
    "Have the owner approve the CRM next step before applying it to the opportunity.",
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
      id: "eval-action-completeness",
      label: "Draft action completeness",
      category: "action-completeness",
      status: allDraftActionsPresent ? "pass" : "warn",
      detail: allDraftActionsPresent
        ? "Prepared email, CRM, Slack, and calendar drafts for approval."
        : "One or more expected draft action types are missing.",
    },
    {
      id: "eval-readiness",
      label: "Review readiness",
      category: "readiness",
      status: readinessScore >= 85 && allDraftActionsPresent ? "pass" : "warn",
      detail:
        "The run is ready for human review because outputs are drafted and approval-gated, with unresolved details called out.",
    },
  ];

  return {
    retrievalScore,
    groundingScore,
    approvalScore,
    missingInfoScore,
    actionCompletenessScore,
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
    ...workflow.missingInfo,
    ...workflow.assumptions,
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
    input.sources.some((source) =>
      /\b(soc2|security|nda)\b/i.test(sourceGroundingText(source)),
    );
  const hasPricingGrounding =
    !needsPricingGrounding ||
    input.sources.some((source) =>
      /\b(pricing|price|discount|quote|48k|arr|finance)\b/i.test(
        sourceGroundingText(source),
      ),
    );
  const hasExplicitFollowUpDate = hasExplicitFollowUp(input.request, workflowText);

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
  const missingInfoScore = Math.max(
    55,
    96 - workflow.missingInfo.length * 8 - (hasExplicitFollowUpDate ? 0 : 6),
  );
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
    hasPricingGrounding
      ? "Pricing language is source grounded but still requires finance or owner approval before customer-facing use."
      : "Pricing language requires source grounding and finance approval before customer-facing use.",
    hasSoc2Grounding
      ? "SOC2 and security claims are source grounded but still require approved sharing context before customer-facing use."
      : "SOC2 and security claims require source grounding before customer-facing use.",
    "Customer-facing actions require approval before any email or calendar draft is used.",
    ...(hasExplicitFollowUpDate
      ? []
      : [
          "Follow-up date and time should be confirmed because the compiled workflow does not include an explicit customer-approved slot.",
        ]),
  ];
  const recommendations = [
    "Confirm pricing before sending the customer email.",
    "Attach the SOC2 one-pager only after the AE or security owner approves the customer follow-up.",
    "Confirm the follow-up time with the customer before using the calendar draft.",
    "Have the owner approve the CRM next step before applying it to the opportunity.",
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
        "SOC2, security, and pricing claims were checked against retrieved seeded workspace sources.",
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
      id: "eval-action-completeness",
      label: "Draft action completeness",
      category: "action-completeness",
      status: allDraftActionsPresent ? "pass" : "warn",
      detail: allDraftActionsPresent
        ? "Email, CRM, Slack, and calendar drafts are prepared and approval-gated."
        : "One or more required draft action types are missing.",
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
    actionCompletenessScore,
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

function sourceGroundingText(source: WorkspaceSource): string {
  return [
    source.title,
    source.snippet,
    source.summary,
    source.content,
    source.tags.join(" "),
  ].join(" ");
}

function hasExplicitFollowUp(request: string, workflowText: string): boolean {
  const text = `${request} ${workflowText}`;
  const asksForFollowUp = /\b(follow-up|follow up|schedule|meeting|calendar)\b/i.test(
    text,
  );

  if (!asksForFollowUp) {
    return true;
  }

  return (
    /\b20\d{2}-\d{2}-\d{2}\b/.test(text) ||
    /\b\d{1,2}\/\d{1,2}\/20\d{2}\b/.test(text) ||
    /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2},?\s+20\d{2}\b/i.test(
      text,
    )
  );
}
