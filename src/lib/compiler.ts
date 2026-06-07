import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import {
  compiledWorkflowSchema,
  type ApprovalGate,
  type CompiledWorkflow,
  type CompiledWorkflowStep,
  type CompilerRiskLevel,
  type CompilerToolName,
  type GeneratedSearchQuery,
} from "./compiler-schema";

const DEFAULT_MODEL = "gpt-4.1-mini";
const ALL_TOOLS: CompilerToolName[] = [
  "gmail",
  "calendar",
  "crm",
  "slack",
  "docs",
];
const ALLOWED_TOOLS = new Set<CompilerToolName>(ALL_TOOLS);
const RISKY_TOPIC_PATTERN =
  /\b(soc\s*2|soc2|security|pricing|price|discount|contract|nda|compliance|proposal)\b/i;
const EXTERNAL_ACTION_PATTERN =
  /\b(customer|external|email|follow-up|follow up|crm|slack|calendar|schedule|meeting|proposal|pricing)\b/i;
const ACTION_INTENT_PATTERN =
  /\b(action|draft|prepare|send|post|create|schedule|update|proposal|customer-facing|external)\b/i;

const SYSTEM_PROMPT =
  "You are a workflow compiler for an AI WorkOS testing lab. Convert messy workplace requests into structured workflow plans. Do not execute tools. Do not invent completed actions. Mark approval gates and risks clearly.";

export type CompileWorkflowResult =
  | {
      compiledWorkflow: CompiledWorkflow;
      mode: "ai";
    }
  | {
      compiledWorkflow: CompiledWorkflow;
      mode: "fallback";
      warning: "AI compiler failed, returned deterministic fallback.";
    };

export async function compileWorkflow(
  request: string,
): Promise<CompileWorkflowResult> {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackCompileResult(request);
  }

  try {
    const result = await generateText({
      model: openai(process.env.OPENAI_MODEL ?? DEFAULT_MODEL),
      output: Output.object({ schema: compiledWorkflowSchema }),
      system: SYSTEM_PROMPT,
      prompt: buildCompilerPrompt(request),
      temperature: 0.2,
    });

    if (!result.output) {
      throw new Error("Compiler returned no structured output.");
    }

    return {
      compiledWorkflow: enforceCompilerRules(result.output),
      mode: "ai",
    };
  } catch (error) {
    console.error("[compile] AI compiler failed:", error);
    return getFallbackCompileResult(request);
  }
}

export function getFallbackCompiledWorkflow(
  request: string,
): CompiledWorkflow {
  const trimmedRequest = request.trim();

  return enforceCompilerRules({
    id: "compiled-acme-fintech-follow-up",
    title: "Acme Fintech post-demo workflow plan",
    summary:
      "Plan a source-grounded, approval-gated follow-up workflow for Acme Fintech covering SOC2, migration timeline, pricing, CRM next steps, an internal Slack update, and calendar follow-up draft.",
    intent:
      "Compile the messy customer request into retrieval, reasoning, draft-preparation, approval, and eval steps without executing any tools.",
    department: "Sales Engineering",
    persona: "Enterprise AE with sales engineering support",
    tools: ALL_TOOLS,
    riskLevel: "high",
    automationPotential:
      "High for planning, seeded retrieval query generation, and draft preparation; execution must remain approval-gated.",
    businessValue:
      "Helps a security-sensitive technical validation opportunity move forward with grounded follow-up planning and clear human review points.",
    assumptions: [
      `Original request preserved for planning: "${trimmedRequest}"`,
      "The customer is Acme Fintech based on the seeded demo workspace.",
      "Yesterday's demo refers to the Acme Fintech product demo on 2026-06-06.",
      "All email, CRM, Slack, and calendar outputs remain drafts until approved.",
    ],
    missingInfo: [
      "Whether the SOC2 Type II report NDA is already countersigned.",
      "Whether finance has approved any pricing concession or non-standard term.",
      "The customer-confirmed follow-up date and time.",
    ],
    steps: [
      {
        id: "step-trigger-parse-request",
        type: "trigger",
        title: "Parse workplace request",
        description:
          "Identify the customer ask, requested topics, required seeded tools, draft outputs, and approval requirement.",
        tool: null,
        goal: "Convert the messy request into an intended workflow plan.",
        dependsOn: [],
        requiresApproval: false,
        riskLevel: "medium",
      },
      {
        id: "step-retrieve-email-context",
        type: "retrieve",
        title: "Plan Gmail context retrieval",
        description:
          "Plan retrieval of customer emails covering SOC2, migration timeline, pricing discussion, and follow-up expectations.",
        tool: "gmail",
        goal: "Find customer-stated requirements before drafting any response.",
        dependsOn: ["step-trigger-parse-request"],
        requiresApproval: false,
        riskLevel: "medium",
      },
      {
        id: "step-retrieve-calendar-context",
        type: "retrieve",
        title: "Plan calendar demo retrieval",
        description:
          "Plan retrieval of yesterday's demo meeting, attendees, notes, and suggested follow-up format.",
        tool: "calendar",
        goal: "Ground scheduling and follow-up context in the seeded calendar record.",
        dependsOn: ["step-trigger-parse-request"],
        requiresApproval: false,
        riskLevel: "low",
      },
      {
        id: "step-retrieve-crm-context",
        type: "retrieve",
        title: "Plan CRM opportunity retrieval",
        description:
          "Plan retrieval of company, ARR potential, stage, risk, decision maker, and next-step fields.",
        tool: "crm",
        goal: "Ground deal status and CRM next-step planning.",
        dependsOn: ["step-trigger-parse-request"],
        requiresApproval: false,
        riskLevel: "medium",
      },
      {
        id: "step-retrieve-slack-docs-context",
        type: "retrieve",
        title: "Plan Slack and docs retrieval",
        description:
          "Plan retrieval of internal security, pricing, and migration guidance plus SOC2, migration, pricing, and onboarding docs.",
        tool: "docs",
        goal: "Require source grounding for SOC2, security, migration, and pricing claims.",
        dependsOn: ["step-trigger-parse-request"],
        requiresApproval: false,
        riskLevel: "high",
      },
      {
        id: "step-reason-grounded-plan",
        type: "reason",
        title: "Plan grounded response synthesis",
        description:
          "Compare the requested follow-up against retrieved sources and identify unresolved approval-sensitive gaps.",
        tool: null,
        goal: "Prepare only source-grounded recommendations and call out missing information.",
        dependsOn: [
          "step-retrieve-email-context",
          "step-retrieve-calendar-context",
          "step-retrieve-crm-context",
          "step-retrieve-slack-docs-context",
        ],
        requiresApproval: false,
        riskLevel: "high",
      },
      {
        id: "step-action-draft-follow-up-email",
        type: "action",
        title: "Plan customer follow-up email draft",
        description:
          "Plan a draft email covering SOC2, migration timeline, pricing confirmation, and next steps. Do not send it.",
        tool: "gmail",
        goal: "Prepare an approval-gated customer email draft.",
        dependsOn: ["step-reason-grounded-plan"],
        requiresApproval: true,
        riskLevel: "high",
      },
      {
        id: "step-action-draft-crm-update",
        type: "action",
        title: "Plan CRM update draft",
        description:
          "Plan a CRM update draft with next steps, deal risk, decision maker context, and approval-sensitive notes. Do not update CRM.",
        tool: "crm",
        goal: "Prepare an approval-gated CRM update draft.",
        dependsOn: ["step-reason-grounded-plan"],
        requiresApproval: true,
        riskLevel: "medium",
      },
      {
        id: "step-action-draft-slack-update",
        type: "action",
        title: "Plan internal Slack update draft",
        description:
          "Plan an internal Slack update draft summarizing security, pricing, migration concerns, owners, and approval needs. Do not post it.",
        tool: "slack",
        goal: "Prepare an approval-gated internal Slack draft.",
        dependsOn: ["step-reason-grounded-plan"],
        requiresApproval: true,
        riskLevel: "medium",
      },
      {
        id: "step-action-draft-calendar-follow-up",
        type: "action",
        title: "Plan calendar follow-up draft",
        description:
          "Plan a calendar follow-up draft with suggested attendees, agenda, and timing options. Do not create an event.",
        tool: "calendar",
        goal: "Prepare an approval-gated calendar draft.",
        dependsOn: ["step-reason-grounded-plan"],
        requiresApproval: true,
        riskLevel: "medium",
      },
      {
        id: "step-approval-review-drafts",
        type: "approval",
        title: "Require human approval",
        description:
          "Require review before any customer email, CRM update, Slack update, or calendar draft is used.",
        tool: null,
        goal: "Prevent unapproved external communication or workspace changes.",
        dependsOn: [
          "step-action-draft-follow-up-email",
          "step-action-draft-crm-update",
          "step-action-draft-slack-update",
          "step-action-draft-calendar-follow-up",
        ],
        requiresApproval: true,
        riskLevel: "high",
      },
      {
        id: "step-eval-safety-readiness",
        type: "eval",
        title: "Plan eval and safety checks",
        description:
          "Plan checks for retrieval coverage, source grounding, approval coverage, missing information, and review readiness.",
        tool: null,
        goal: "Verify the workflow remains draft-only, grounded, and approval-gated.",
        dependsOn: ["step-approval-review-drafts"],
        requiresApproval: false,
        riskLevel: "medium",
      },
    ],
    approvalGates: [
      {
        id: "approval-customer-facing-email",
        title: "Customer email approval",
        description:
          "Customer-facing SOC2, migration, and pricing language must be reviewed before use.",
        requiredForTools: ["gmail"],
        riskLevel: "high",
        reason:
          "External communication includes security, SOC2, pricing, and scheduling details.",
      },
      {
        id: "approval-workspace-drafts",
        title: "Workspace draft approval",
        description:
          "CRM, Slack, and calendar drafts require review before any real workspace change or coordination occurs.",
        requiredForTools: ["crm", "slack", "calendar"],
        riskLevel: "medium",
        reason:
          "Drafts affect deal reporting, internal strategy, and meeting coordination.",
      },
    ],
    evalChecks: [
      {
        id: "eval-retrieval-coverage",
        label: "Seeded retrieval coverage",
        category: "retrieval",
        description:
          "Confirm the planned retrieval covers Gmail, Calendar, CRM, Slack, and Docs.",
        riskLevel: "medium",
      },
      {
        id: "eval-soc2-pricing-grounding",
        label: "SOC2 and pricing grounding",
        category: "grounding",
        description:
          "Confirm SOC2, security, migration, and pricing claims are grounded in retrieved seeded sources.",
        riskLevel: "high",
      },
      {
        id: "eval-approval-gates",
        label: "Approval coverage",
        category: "approval",
        description:
          "Confirm every customer-facing or workspace-changing draft requires human approval.",
        riskLevel: "high",
      },
      {
        id: "eval-missing-info",
        label: "Missing information",
        category: "missing-info",
        description:
          "Confirm unresolved NDA, finance approval, and scheduling details are listed before draft use.",
        riskLevel: "medium",
      },
      {
        id: "eval-review-readiness",
        label: "Review readiness",
        category: "readiness",
        description:
          "Confirm the compiled workflow is ready for seeded runner retrieval and draft preparation.",
        riskLevel: "medium",
      },
    ],
    generatedSearchQueries: [
      {
        id: "query-gmail-acme-context",
        tool: "gmail",
        query:
          "Acme Fintech SOC2 migration timeline pricing follow-up customer email",
        purpose:
          "Find customer email threads covering SOC2, migration, pricing, and follow-up.",
      },
      {
        id: "query-calendar-yesterday-demo",
        tool: "calendar",
        query:
          "Acme Fintech yesterday demo attendees meeting notes follow-up security RevOps",
        purpose:
          "Find the demo meeting, attendees, notes, and suggested follow-up.",
      },
      {
        id: "query-crm-acme-opportunity",
        tool: "crm",
        query:
          "Acme Fintech opportunity ARR technical validation risk decision maker next step",
        purpose:
          "Find opportunity metadata and current next-step context.",
      },
      {
        id: "query-slack-security-pricing",
        tool: "slack",
        query:
          "Acme Fintech SOC2 security migration pricing finance approval founder engineer AE",
        purpose:
          "Find internal guidance on security, pricing, and migration concerns.",
      },
      {
        id: "query-docs-grounding",
        tool: "docs",
        query:
          "SOC2 Type II one-pager migration plan pricing FAQ onboarding checklist",
        purpose:
          "Find source documents for SOC2, migration timeline, pricing, and onboarding claims.",
      },
    ],
  });
}

function buildCompilerPrompt(request: string): string {
  return `Compile this workplace request into a strict structured workflow plan.

Request:
${request}

Rules:
- Return only the object required by the schema.
- Do not omit any fields. Every property in the schema must be present.
- For steps that do not use a tool, set tool to null. Do not omit any fields.
- For arrays with no items, return an empty array instead of omitting the field.
- This is planning only. Do not say you searched, retrieved, sent, posted, created, scheduled, or updated anything.
- Describe intended workflow steps using future/planning language.
- Allowed tools: gmail, slack, crm, docs, calendar.
- Allowed step types: trigger, retrieve, reason, action, approval, eval.
- Customer-facing or external actions must require approval.
- CRM, Slack, and calendar workspace-changing actions must require approval.
- Pricing, SOC2, security, compliance, NDA, and proposal claims are risky and require source grounding.
- generatedSearchQueries should be useful for the seeded workspace retrieval system.`;
}

function enforceCompilerRules(workflow: CompiledWorkflow): CompiledWorkflow {
  const steps = workflow.steps.map(enforceStepRules);
  const approvalGates = workflow.approvalGates.map(enforceApprovalGateRules);
  const tools = uniqueValidTools(workflow.tools);
  const generatedSearchQueries = ensureSearchQueries(
    workflow.generatedSearchQueries,
  );
  const hasHighRisk =
    workflow.riskLevel === "high" ||
    steps.some((step) => step.riskLevel === "high") ||
    approvalGates.some((gate) => gate.riskLevel === "high");

  return compiledWorkflowSchema.parse({
    ...workflow,
    tools,
    riskLevel: hasHighRisk ? "high" : workflow.riskLevel,
    steps,
    approvalGates,
    generatedSearchQueries,
  });
}

function enforceStepRules(step: CompiledWorkflowStep): CompiledWorkflowStep {
  const text = `${step.title} ${step.description ?? ""} ${step.goal}`;
  const isAction = step.type === "action";
  const needsApproval =
    isAction ||
    step.type === "approval" ||
    (EXTERNAL_ACTION_PATTERN.test(text) && ACTION_INTENT_PATTERN.test(text));
  const isRisky = RISKY_TOPIC_PATTERN.test(text);

  return {
    ...step,
    tool: step.tool && ALLOWED_TOOLS.has(step.tool) ? step.tool : null,
    requiresApproval: step.requiresApproval || needsApproval,
    riskLevel: highestRisk(step.riskLevel, isRisky ? "high" : step.riskLevel),
  };
}

function enforceApprovalGateRules(gate: ApprovalGate): ApprovalGate {
  const text = `${gate.title} ${gate.description ?? ""} ${gate.reason}`;
  const isRisky = RISKY_TOPIC_PATTERN.test(text);
  const requiredForTools = uniqueValidTools(gate.requiredForTools);

  return {
    ...gate,
    requiredForTools:
      requiredForTools.length > 0 ? requiredForTools : ["gmail"],
    riskLevel: highestRisk(gate.riskLevel, isRisky ? "high" : gate.riskLevel),
  };
}

function ensureSearchQueries(
  queries: GeneratedSearchQuery[],
): GeneratedSearchQuery[] {
  const validQueries = queries.filter((query) => ALLOWED_TOOLS.has(query.tool));

  if (validQueries.length > 0) {
    return validQueries;
  }

  return [
    {
      id: "query-fallback-seeded-workspace",
      tool: "docs",
      query:
        "SOC2 migration timeline pricing follow-up seeded workplace context",
      purpose:
        "Provide at least one seeded workspace retrieval query for the compiled workflow.",
    },
  ];
}

function uniqueValidTools(tools: CompilerToolName[]): CompilerToolName[] {
  const validTools = tools.filter((tool) => ALLOWED_TOOLS.has(tool));
  const uniqueTools = Array.from(new Set(validTools));

  return uniqueTools.length > 0 ? uniqueTools : ALL_TOOLS;
}

function getFallbackCompileResult(request: string): CompileWorkflowResult {
  return {
    compiledWorkflow: getFallbackCompiledWorkflow(request),
    mode: "fallback",
    warning: "AI compiler failed, returned deterministic fallback.",
  };
}

function highestRisk(
  current: CompilerRiskLevel,
  candidate: CompilerRiskLevel,
): CompilerRiskLevel {
  const rank: Record<CompilerRiskLevel, number> = {
    low: 0,
    medium: 1,
    high: 2,
  };

  return rank[candidate] > rank[current] ? candidate : current;
}
