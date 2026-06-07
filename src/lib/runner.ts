import { evaluateRun } from "./eval";
import { searchWorkspace } from "./search";
import type { CompiledWorkflow } from "./compiler-schema";
import type {
  DemoRun,
  DraftAction,
  ToolName,
  TraceEvent,
  WorkflowStep,
  WorkflowSummaryData,
  WorkspaceSource,
} from "./types";

const WORKFLOW_TOOLS: ToolName[] = ["gmail", "calendar", "crm", "slack", "docs"];

const TOOL_QUERIES: Record<ToolName, string> = {
  gmail: "Acme Fintech SOC2 migration timeline pricing follow-up customer email",
  calendar: "Acme Fintech yesterday demo attendees meeting notes follow-up",
  crm: "Acme Fintech 48k ARR technical validation security review decision maker next step",
  slack: "Acme Fintech SOC2 migration pricing finance approval founder engineer AE",
  docs: "SOC2 one-pager migration plan pricing FAQ onboarding checklist",
};

interface SearchQueryRun {
  id: string;
  tool?: ToolName;
  query: string;
  purpose: string;
  resultCount: number;
  sourceIds: string[];
}

export function runWorkflow(
  request: string,
  compiledWorkflow?: CompiledWorkflow,
): DemoRun {
  if (compiledWorkflow) {
    return runCompiledWorkflow(request, compiledWorkflow);
  }

  return runRequestOnlyWorkflow(request);
}

function runRequestOnlyWorkflow(request: string): DemoRun {
  const trimmedRequest = request.trim();
  const sources = retrieveSources(trimmedRequest);
  const workflowSteps = createWorkflowSteps();
  const traceEvents = createTraceEvents(sources);
  const draftActions = createDraftActions();
  const evalReport = evaluateRun({
    request: trimmedRequest,
    sources,
    draftActions,
  });
  const totalDurationMs = traceEvents.reduce(
    (total, event) => total + event.durationMs,
    0,
  );
  const workflowSummary: WorkflowSummaryData = {
    title: "Acme Fintech post-demo follow-up workflow",
    department: "Sales Engineering",
    persona: "Enterprise AE with sales engineering support",
    riskLevel: "medium",
    automationPotential:
      "High for seeded context retrieval and draft preparation; human approval is required before any real tool work.",
    businessValue:
      "Helps a security-sensitive technical validation deal move toward review with grounded draft actions.",
    tools: WORKFLOW_TOOLS,
    missingInfo: [
      "Whether the SOC2 Type II report NDA is already countersigned",
      "Finance approval for any non-standard pricing language",
      "Customer-confirmed exact follow-up date and time",
    ],
    assumptions: [
      "Yesterday's demo refers to the Acme Fintech product demo on 2026-06-06",
      "The follow-up owner is Jamie Lee, the account executive on the deal",
      "All outputs are drafts and require approval before use",
    ],
    stepsCount: workflowSteps.length,
    sourcesFound: sources.length,
    actionsGenerated: draftActions.length,
    totalDurationMs,
    connectors: WORKFLOW_TOOLS,
  };

  const run: DemoRun = {
    request: trimmedRequest,
    workflowSummary,
    workflowSteps,
    steps: workflowSteps,
    sources,
    traceEvents,
    trace: traceEvents,
    draftActions,
    actions: draftActions,
    evalReport,
    eval: evalReport,
    rawJson: {},
  };

  run.rawJson = {
    mode: "request-only",
    request: run.request,
    workflowSummary: run.workflowSummary,
    workflowSteps: run.workflowSteps,
    sources: run.sources,
    traceEvents: run.traceEvents,
    draftActions: run.draftActions,
    evalReport: run.evalReport,
  };

  return run;
}

function runCompiledWorkflow(
  request: string,
  compiledWorkflow: CompiledWorkflow,
): DemoRun {
  const trimmedRequest = request.trim();
  const { sources, searchQueriesUsed } = retrieveCompiledSources(
    trimmedRequest,
    compiledWorkflow,
  );
  const workflowSteps = createCompiledWorkflowSteps(compiledWorkflow);
  const draftActions = createCompiledDraftActions(compiledWorkflow, sources);
  const evalReport = evaluateRun({
    request: trimmedRequest,
    sources,
    draftActions,
    compiledWorkflow,
  });
  const traceEvents = createCompiledTraceEvents({
    compiledWorkflow,
    sources,
    searchQueriesUsed,
    draftActions,
    readinessScore: evalReport.readinessScore,
  });
  const totalDurationMs = traceEvents.reduce(
    (total, event) => total + event.durationMs,
    0,
  );
  const tools = compiledWorkflow.tools.length
    ? compiledWorkflow.tools
    : WORKFLOW_TOOLS;
  const workflowSummary: WorkflowSummaryData = {
    title: compiledWorkflow.title,
    department: compiledWorkflow.department,
    persona: compiledWorkflow.persona,
    riskLevel: compiledWorkflow.riskLevel,
    automationPotential: compiledWorkflow.automationPotential,
    businessValue: compiledWorkflow.businessValue,
    tools,
    missingInfo: compiledWorkflow.missingInfo,
    assumptions: compiledWorkflow.assumptions,
    stepsCount: workflowSteps.length,
    sourcesFound: sources.length,
    actionsGenerated: draftActions.length,
    totalDurationMs,
    connectors: tools,
  };

  const run: DemoRun = {
    request: trimmedRequest,
    workflowSummary,
    workflowSteps,
    steps: workflowSteps,
    sources,
    traceEvents,
    trace: traceEvents,
    draftActions,
    actions: draftActions,
    evalReport,
    eval: evalReport,
    rawJson: {
      mode: "compiled-workflow",
      compiledWorkflow,
      searchQueriesUsed,
      sourceIdsUsed: sources.map((source) => source.id),
    },
  };

  return run;
}

function retrieveCompiledSources(
  request: string,
  compiledWorkflow: CompiledWorkflow,
): { sources: WorkspaceSource[]; searchQueriesUsed: SearchQueryRun[] } {
  const generatedQueries = compiledWorkflow.generatedSearchQueries.filter(
    (query) => query.query.trim(),
  );

  if (generatedQueries.length === 0) {
    const sources = retrieveSources(request).slice(0, 10);
    const searchQueriesUsed = WORKFLOW_TOOLS.map((tool) => ({
      id: `fallback-${tool}`,
      tool,
      query: `${request} ${TOOL_QUERIES[tool]}`,
      purpose: "Fallback request-based seeded workspace search.",
      resultCount: sources.filter((source) => source.tool === tool).length,
      sourceIds: sources
        .filter((source) => source.tool === tool)
        .map((source) => source.id),
    }));

    return { sources, searchQueriesUsed };
  }

  const byId = new Map<string, WorkspaceSource>();
  const searchQueriesUsed: SearchQueryRun[] = [];

  for (const query of generatedQueries) {
    const results = searchWorkspace(query.query, [query.tool]);
    searchQueriesUsed.push({
      id: query.id,
      tool: query.tool,
      query: query.query,
      purpose: query.purpose,
      resultCount: results.length,
      sourceIds: results.map((source) => source.id),
    });

    for (const source of results) {
      const existing = byId.get(source.id);

      if (!existing || source.relevanceScore > existing.relevanceScore) {
        byId.set(source.id, source);
      }
    }
  }

  const sources = Array.from(byId.values())
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }

      return a.id.localeCompare(b.id);
    })
    .slice(0, 10);

  return { sources, searchQueriesUsed };
}

function createCompiledWorkflowSteps(
  compiledWorkflow: CompiledWorkflow,
): WorkflowStep[] {
  const fallbackConnector = compiledWorkflow.tools[0] ?? "docs";

  return compiledWorkflow.steps.map((step, index) => {
    const connector = step.tool ?? connectorForStepType(step.type, fallbackConnector);
    const requiresApproval =
      step.requiresApproval || step.type === "approval" || step.type === "action";

    return {
      id: step.id,
      type: step.type,
      title: step.title,
      label: stepLabel(step.title, index),
      description: step.description ?? step.goal,
      tool: step.tool ?? undefined,
      connector,
      status: requiresApproval ? "requires_approval" : "completed",
      riskLevel: step.riskLevel,
      requiresApproval,
      durationMs: durationForStepType(step.type, index),
    };
  });
}

function createCompiledTraceEvents(input: {
  compiledWorkflow: CompiledWorkflow;
  sources: WorkspaceSource[];
  searchQueriesUsed: SearchQueryRun[];
  draftActions: DraftAction[];
  readinessScore: number;
}): TraceEvent[] {
  const sourceIds = input.sources.map((source) => source.id);
  const searchDetail = WORKFLOW_TOOLS.map((tool) => {
    const queryCount = input.searchQueriesUsed.filter(
      (query) => query.tool === tool,
    ).length;
    const sourceCount = input.sources.filter((source) => source.tool === tool).length;

    return `${tool}: ${queryCount} queries, ${sourceCount} sources`;
  }).join("; ");
  const approvalDetail =
    input.compiledWorkflow.approvalGates.length > 0
      ? input.compiledWorkflow.approvalGates
          .map(
            (gate) =>
              `${gate.title} requires ${gate.requiredForTools.join(", ")} review`,
          )
          .join("; ")
      : "No compiled approval gates were provided, so all drafts remain approval required.";

  return [
    {
      id: "trace-compiled-001",
      stepId: input.compiledWorkflow.steps[0]?.id ?? "compiled-plan",
      type: "compile",
      status: "success",
      title: "AI workflow plan received",
      label: "Plan received",
      description: `Received compiled plan: ${input.compiledWorkflow.title}.`,
      detail: input.compiledWorkflow.intent,
      timestamp: "2026-06-07T09:30:00+05:30",
      durationMs: 110,
    },
    {
      id: "trace-compiled-002",
      stepId: input.compiledWorkflow.steps[0]?.id ?? "compiled-search",
      type: "compile",
      status: "success",
      title: "Generated search queries prepared",
      label: "Queries prepared",
      description: `${input.searchQueriesUsed.length} seeded workspace search queries prepared from the compiled workflow.`,
      detail: input.searchQueriesUsed
        .map((query) => `${query.tool ?? "all"}: ${query.query}`)
        .join(" | "),
      timestamp: "2026-06-07T09:30:02+05:30",
      durationMs: 140,
    },
    {
      id: "trace-compiled-003",
      stepId: "compiled-search-by-tool",
      type: "search",
      status: "success",
      title: "Seeded workspace searched by tool",
      label: "Workspace search",
      description:
        "Ran generated queries against the seeded Gmail, Calendar, CRM, Slack, and Docs workspace.",
      detail: searchDetail,
      sources: sourceIds,
      timestamp: "2026-06-07T09:30:06+05:30",
      durationMs: 280,
    },
    {
      id: "trace-compiled-004",
      stepId: "compiled-sources-retrieved",
      type: "retrieve",
      status: input.sources.length > 0 ? "success" : "warning",
      title: "Sources retrieved",
      label: "Sources retrieved",
      description: `Retrieved ${input.sources.length} deduplicated seeded sources sorted by relevance.`,
      detail: sourceIds.join(", "),
      sources: sourceIds,
      timestamp: "2026-06-07T09:30:11+05:30",
      durationMs: 210,
    },
    {
      id: "trace-compiled-005",
      stepId: "compiled-drafts-prepared",
      type: "draft",
      status: "success",
      title: "Draft actions prepared",
      label: "Drafts prepared",
      description: `${input.draftActions.length} approval-gated draft actions prepared from retrieved seeded sources.`,
      detail:
        "Prepared customer email draft, CRM update draft, internal Slack update draft, and calendar follow-up draft. No real tool action occurred.",
      sources: sourceIds,
      timestamp: "2026-06-07T09:30:16+05:30",
      durationMs: 340,
    },
    {
      id: "trace-compiled-006",
      stepId: "compiled-approval-gates",
      type: "compile",
      status:
        input.compiledWorkflow.approvalGates.length > 0 ? "success" : "warning",
      title: "Approval gates applied",
      label: "Approval gates",
      description:
        "All prepared drafts remain approval required before email, CRM, Slack, or calendar use.",
      detail: approvalDetail,
      timestamp: "2026-06-07T09:30:20+05:30",
      durationMs: 100,
    },
    {
      id: "trace-compiled-007",
      stepId: "compiled-eval-completed",
      type: "eval",
      status: "success",
      title: "Eval completed",
      label: "Eval completed",
      description:
        "Completed retrieval, grounding, approval, missing-info, and readiness evaluation.",
      detail: `Readiness score: ${input.readinessScore}.`,
      timestamp: "2026-06-07T09:30:24+05:30",
      durationMs: 170,
    },
  ];
}

function createCompiledDraftActions(
  compiledWorkflow: CompiledWorkflow,
  sources: WorkspaceSource[],
): DraftAction[] {
  const approvalText = approvalGateText(compiledWorkflow);
  const missingInfoText = missingInfoTextForDrafts(compiledWorkflow);
  const planText = `Compiled plan: ${compiledWorkflow.title}. Intent: ${compiledWorkflow.intent}`;
  const emailSourceIds = sourceIdsForAction(sources, [
    "gmail",
    "calendar",
    "crm",
    "docs",
  ]);
  const crmSourceIds = sourceIdsForAction(sources, [
    "crm",
    "gmail",
    "calendar",
    "slack",
    "docs",
  ]);
  const slackSourceIds = sourceIdsForAction(sources, [
    "slack",
    "crm",
    "calendar",
    "docs",
    "gmail",
  ]);
  const calendarSourceIds = sourceIdsForAction(sources, [
    "calendar",
    "gmail",
    "crm",
    "docs",
  ]);

  return [
    {
      id: "draft-email-customer-follow-up",
      type: "email",
      title: "Customer follow-up email draft",
      summary:
        "Drafted customer follow-up grounded in the compiled workflow, retrieved SOC2, migration, pricing, CRM, and calendar context.",
      targetTool: "gmail",
      recipient: "Maya Desai <maya.desai@acmefintech.example>",
      status: "approval_required",
      requiresApproval: true,
      approvalReason: approvalReasonForTool(compiledWorkflow, "gmail"),
      sourceIds: emailSourceIds,
      body: `To: Maya Desai <maya.desai@acmefintech.example>
Subject: Follow-up from yesterday's demo

Hi Maya,

Thank you for joining yesterday's demo with Raj. I prepared a follow-up draft for Acme's technical validation using the approved seeded workspace context.

${planText}

Grounded context:
${sourceEvidence(sources, emailSourceIds)}

Prepared response points:
- SOC2: provide the customer-safe SOC2 Type II one-pager after approval; the full report path still depends on NDA confirmation.
- Migration: use the four-to-six week estimate for 18 workflows when Acme names an admin owner and connector mapping starts early.
- Pricing: reference the current $48k ARR enterprise path and keep any concession language pending finance review.
- Follow-up: propose a 30-minute security and RevOps session with Maya, Raj, Jamie, and Alex.

${missingInfoText}
${approvalText}

Approval required before this draft is used.`,
    },
    {
      id: "draft-crm-next-steps",
      type: "crm",
      title: "CRM update draft",
      summary:
        "Prepared CRM update draft grounded in the compiled workflow, opportunity source, customer asks, and approval gates.",
      targetTool: "crm",
      status: "approval_required",
      requiresApproval: true,
      approvalReason: approvalReasonForTool(compiledWorkflow, "crm"),
      sourceIds: crmSourceIds,
      body: `Opportunity: Acme Fintech

${planText}

Grounded context:
${sourceEvidence(sources, crmSourceIds)}

Prepared CRM update draft:
- Add a post-demo note covering SOC2, migration timeline, pricing confirmation, and stakeholder follow-up.
- Keep stage as technical validation and risk as security review until NDA status is confirmed.
- Prepare next step for Jamie to coordinate security one-pager review, migration plan review, and pricing approval review.
- Track finance review before any customer-facing pricing concession language.

${missingInfoText}
${approvalText}

Approval required before this CRM draft is used.`,
    },
    {
      id: "draft-slack-internal-update",
      type: "slack",
      title: "Internal Slack update draft",
      summary:
        "Prepared internal Slack update draft grounded in retrieved internal guidance, deal context, and compiled approval requirements.",
      targetTool: "slack",
      status: "approval_required",
      requiresApproval: true,
      approvalReason: approvalReasonForTool(compiledWorkflow, "slack"),
      sourceIds: slackSourceIds,
      body: `Channel: #deal-acme-fintech

Prepared internal update draft:

${planText}

Grounded context:
${sourceEvidence(sources, slackSourceIds)}

Customer asks:
- SOC2 one-pager and full report path under NDA.
- Migration timeline for 18 active workflows.
- Confirmation of the current enterprise pricing path.
- Follow-up with security and RevOps stakeholders.

Owner review:
- Jamie: review customer follow-up and CRM draft.
- Alex: confirm migration estimate and follow-up attendance.
- Priya: review pricing language and finance approval requirement.

${missingInfoText}
${approvalText}

Approval required before this Slack draft is used.`,
    },
    {
      id: "draft-calendar-follow-up",
      type: "calendar",
      title: "Calendar follow-up draft",
      summary:
        "Prepared calendar follow-up draft grounded in the compiled workflow, demo notes, and unresolved scheduling information.",
      targetTool: "calendar",
      status: "approval_required",
      requiresApproval: true,
      approvalReason: approvalReasonForTool(compiledWorkflow, "calendar"),
      sourceIds: calendarSourceIds,
      body: `Title: Acme Fintech security and migration follow-up
Duration: 30 minutes
Suggested window: Tuesday or Wednesday afternoon
Proposed attendees: Maya Desai, Raj Mehta, Jamie Lee, Alex Kim

${planText}

Grounded context:
${sourceEvidence(sources, calendarSourceIds)}

Agenda draft:
1. Confirm SOC2 report-sharing path and NDA status.
2. Review the four-to-six week migration plan and owner responsibilities.
3. Review pricing proposal path and finance approval requirement.
4. Align technical validation next steps and decision timeline.

${missingInfoText}
${approvalText}

Approval required before this calendar draft is used.`,
    },
  ];
}

function sourceIdsForAction(
  sources: WorkspaceSource[],
  preferredTools: ToolName[],
): string[] {
  const ids: string[] = [];

  for (const tool of preferredTools) {
    for (const source of sources.filter((candidate) => candidate.tool === tool)) {
      if (!ids.includes(source.id)) {
        ids.push(source.id);
      }

      if (ids.length >= 7) {
        return ids;
      }
    }
  }

  for (const source of sources) {
    if (!ids.includes(source.id)) {
      ids.push(source.id);
    }

    if (ids.length >= 7) {
      break;
    }
  }

  return ids;
}

function sourceEvidence(sources: WorkspaceSource[], sourceIds: string[]): string {
  const evidence = sourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is WorkspaceSource => Boolean(source))
    .slice(0, 5)
    .map((source) => `- ${source.title}: ${source.snippet}`);

  return evidence.length > 0
    ? evidence.join("\n")
    : "- No seeded source matched this draft directly; approval review should verify the content.";
}

function approvalGateText(compiledWorkflow: CompiledWorkflow): string {
  if (compiledWorkflow.approvalGates.length === 0) {
    return "Approval gates: all drafts are approval required because no compiled gate narrowed the review path.";
  }

  return `Approval gates: ${compiledWorkflow.approvalGates
    .map((gate) => `${gate.title} (${gate.requiredForTools.join(", ")})`)
    .join("; ")}.`;
}

function missingInfoTextForDrafts(compiledWorkflow: CompiledWorkflow): string {
  if (compiledWorkflow.missingInfo.length === 0) {
    return "Missing information: none listed by the compiled workflow.";
  }

  return `Missing information to resolve:
${compiledWorkflow.missingInfo.map((item) => `- ${item}`).join("\n")}`;
}

function approvalReasonForTool(
  compiledWorkflow: CompiledWorkflow,
  tool: ToolName,
): string {
  const gate = compiledWorkflow.approvalGates.find((candidate) =>
    candidate.requiredForTools.includes(tool),
  );

  if (gate) {
    return `${gate.title}: ${gate.reason}`;
  }

  return "Approval required before any drafted customer communication or workspace change is used.";
}

function connectorForStepType(
  type: WorkflowStep["type"],
  fallbackConnector: ToolName,
): ToolName {
  if (type === "eval" || type === "reason") {
    return "docs";
  }

  if (type === "approval") {
    return "crm";
  }

  return fallbackConnector;
}

function stepLabel(title: string, index: number): string {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length <= 24) {
    return trimmedTitle;
  }

  return `Step ${index + 1}`;
}

function durationForStepType(type: WorkflowStep["type"], index: number): number {
  const baseDuration: Record<WorkflowStep["type"], number> = {
    trigger: 120,
    retrieve: 190,
    reason: 260,
    action: 320,
    approval: 110,
    eval: 170,
  };

  return baseDuration[type] + index * 5;
}

function retrieveSources(request: string): WorkspaceSource[] {
  const byId = new Map<string, WorkspaceSource>();

  for (const tool of WORKFLOW_TOOLS) {
    const limit = tool === "docs" ? 4 : 2;
    const results = searchWorkspace(`${request} ${TOOL_QUERIES[tool]}`, [tool]);

    for (const source of results.slice(0, limit)) {
      byId.set(source.id, source);
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }

    return a.id.localeCompare(b.id);
  });
}

function createWorkflowSteps(): WorkflowStep[] {
  return [
    {
      id: "step-trigger",
      type: "trigger",
      title: "Parse workplace request",
      label: "Parse request",
      description:
        "Identify the customer, requested topics, required seeded connectors, draft actions, and approval requirement.",
      connector: "gmail",
      status: "completed",
      riskLevel: "medium",
      requiresApproval: false,
      durationMs: 120,
    },
    {
      id: "step-retrieve-gmail",
      type: "retrieve",
      title: "Retrieve customer email context",
      label: "Search Gmail",
      description:
        "Find Acme Fintech email threads covering SOC2, migration timeline, pricing, and follow-up expectations.",
      tool: "gmail",
      connector: "gmail",
      status: "completed",
      riskLevel: "low",
      requiresApproval: false,
      durationMs: 180,
    },
    {
      id: "step-retrieve-calendar",
      type: "retrieve",
      title: "Retrieve demo meeting notes",
      label: "Search Calendar",
      description:
        "Locate yesterday's demo, attendees, notes, and the suggested stakeholder follow-up.",
      tool: "calendar",
      connector: "calendar",
      status: "completed",
      riskLevel: "low",
      requiresApproval: false,
      durationMs: 150,
    },
    {
      id: "step-retrieve-crm",
      type: "retrieve",
      title: "Retrieve CRM deal record",
      label: "Search CRM",
      description:
        "Confirm ARR potential, stage, risk, decision maker, and next step for the Acme Fintech opportunity.",
      tool: "crm",
      connector: "crm",
      status: "completed",
      riskLevel: "low",
      requiresApproval: false,
      durationMs: 140,
    },
    {
      id: "step-retrieve-slack-docs",
      type: "retrieve",
      title: "Retrieve Slack and docs guidance",
      label: "Search Slack and Docs",
      description:
        "Collect internal guidance plus SOC2, migration, pricing, and onboarding knowledge base sources.",
      tool: "slack",
      connector: "slack",
      status: "completed",
      riskLevel: "medium",
      requiresApproval: false,
      durationMs: 240,
    },
    {
      id: "step-reason",
      type: "reason",
      title: "Compile grounded workflow summary",
      label: "Compile context",
      description:
        "Resolve customer asks against retrieved sources and call out open approvals for security and pricing claims.",
      connector: "docs",
      status: "completed",
      riskLevel: "medium",
      requiresApproval: false,
      durationMs: 260,
    },
    {
      id: "step-actions",
      type: "action",
      title: "Prepare draft actions",
      label: "Prepare drafts",
      description:
        "Prepare the customer email, CRM next steps, internal Slack update, and calendar follow-up draft.",
      connector: "crm",
      status: "requires_approval",
      riskLevel: "medium",
      requiresApproval: true,
      durationMs: 320,
    },
    {
      id: "step-approval",
      type: "approval",
      title: "Hold drafts for approval",
      label: "Approval gate",
      description:
        "Require a human reviewer before any prepared draft can be used in email, CRM, Slack, or calendar.",
      connector: "calendar",
      status: "requires_approval",
      riskLevel: "medium",
      requiresApproval: true,
      durationMs: 90,
    },
    {
      id: "step-eval",
      type: "eval",
      title: "Generate eval and safety report",
      label: "Evaluate run",
      description:
        "Score retrieval quality, grounding, approval coverage, missing information, and readiness.",
      connector: "docs",
      status: "completed",
      riskLevel: "low",
      requiresApproval: false,
      durationMs: 170,
    },
  ];
}

function createTraceEvents(sources: WorkspaceSource[]): TraceEvent[] {
  const sourceIds = sources.map((source) => source.id);

  return [
    {
      id: "trace-001",
      stepId: "step-trigger",
      type: "compile",
      status: "success",
      title: "Request parsed into workflow intents",
      label: "Request parsed",
      description:
        "Detected retrieval needs for Gmail, Calendar, CRM, Slack, and Docs plus four approval-gated drafts.",
      detail:
        "Detected retrieval needs for Gmail, Calendar, CRM, Slack, and Docs plus four approval-gated drafts.",
      timestamp: "2026-06-07T09:30:00+05:30",
      durationMs: 120,
    },
    {
      id: "trace-002",
      stepId: "step-retrieve-gmail",
      type: "search",
      status: "success",
      title: "Gmail sources retrieved",
      label: "Gmail search",
      description:
        "Found customer emails asking about SOC2, migration timeline, pricing confirmation, and follow-up.",
      detail:
        "Found customer emails asking about SOC2, migration timeline, pricing confirmation, and follow-up.",
      tool: "gmail",
      connector: "gmail",
      sources: sourceIds.filter((id) => id.startsWith("src-gmail")),
      timestamp: "2026-06-07T09:30:04+05:30",
      durationMs: 180,
    },
    {
      id: "trace-003",
      stepId: "step-retrieve-calendar",
      type: "retrieve",
      status: "success",
      title: "Calendar demo notes retrieved",
      label: "Calendar retrieve",
      description:
        "Confirmed the product demo happened on 2026-06-06 with customer stakeholders and internal owner notes.",
      detail:
        "Confirmed the product demo happened on 2026-06-06 with customer stakeholders and internal owner notes.",
      tool: "calendar",
      connector: "calendar",
      sources: sourceIds.filter((id) => id.startsWith("src-calendar")),
      timestamp: "2026-06-07T09:30:07+05:30",
      durationMs: 150,
    },
    {
      id: "trace-004",
      stepId: "step-retrieve-crm",
      type: "retrieve",
      status: "success",
      title: "CRM deal record retrieved",
      label: "CRM retrieve",
      description:
        "Confirmed Acme Fintech is a $48k ARR technical validation opportunity with security review risk.",
      detail:
        "Confirmed Acme Fintech is a $48k ARR technical validation opportunity with security review risk.",
      tool: "crm",
      connector: "crm",
      sources: sourceIds.filter((id) => id.startsWith("src-crm")),
      timestamp: "2026-06-07T09:30:10+05:30",
      durationMs: 140,
    },
    {
      id: "trace-005",
      stepId: "step-retrieve-slack-docs",
      type: "search",
      status: "success",
      title: "Slack and docs context retrieved",
      label: "Slack and docs search",
      description:
        "Found internal guidance and knowledge base documents for SOC2, migration, pricing, and onboarding.",
      detail:
        "Found internal guidance and knowledge base documents for SOC2, migration, pricing, and onboarding.",
      tool: "slack",
      connector: "slack",
      sources: sourceIds.filter(
        (id) => id.startsWith("src-slack") || id.startsWith("src-doc"),
      ),
      timestamp: "2026-06-07T09:30:16+05:30",
      durationMs: 240,
    },
    {
      id: "trace-006",
      stepId: "step-reason",
      type: "analyze",
      status: "warning",
      title: "Context merged with approval-sensitive gaps",
      label: "Context analysis",
      description:
        "Grounded the response plan and flagged NDA status, finance approval, and customer availability as unresolved items.",
      detail:
        "Grounded the response plan and flagged NDA status, finance approval, and customer availability as unresolved items.",
      sources: sourceIds,
      timestamp: "2026-06-07T09:30:22+05:30",
      durationMs: 260,
    },
    {
      id: "trace-007",
      stepId: "step-actions",
      type: "draft",
      status: "success",
      title: "Four draft actions prepared",
      label: "Drafts prepared",
      description:
        "Prepared email, CRM, Slack, and calendar drafts. No real tool action occurred.",
      detail:
        "Prepared email, CRM, Slack, and calendar drafts. No real tool action occurred.",
      sources: sourceIds,
      timestamp: "2026-06-07T09:30:31+05:30",
      durationMs: 320,
    },
    {
      id: "trace-008",
      stepId: "step-approval",
      type: "compile",
      status: "success",
      title: "Approval gate applied",
      label: "Approval gate",
      description:
        "All prepared drafts require review because they include customer communication, CRM notes, internal coordination, or calendar planning.",
      detail:
        "All prepared drafts require review because they include customer communication, CRM notes, internal coordination, or calendar planning.",
      timestamp: "2026-06-07T09:30:33+05:30",
      durationMs: 90,
    },
    {
      id: "trace-009",
      stepId: "step-eval",
      type: "eval",
      status: "success",
      title: "Eval report generated",
      label: "Eval completed",
      description:
        "Retrieval, grounding, approval coverage, missing information, and readiness were scored for the prepared run.",
      detail:
        "Retrieval, grounding, approval coverage, missing information, and readiness were scored for the prepared run.",
      timestamp: "2026-06-07T09:30:36+05:30",
      durationMs: 170,
    },
  ];
}

function createDraftActions(): DraftAction[] {
  return [
    {
      id: "draft-email-customer-follow-up",
      type: "email",
      title: "Customer follow-up email draft",
      summary:
        "Prepared customer follow-up covering SOC2, migration timeline, pricing, and approval-sensitive next steps.",
      targetTool: "gmail",
      recipient: "Maya Desai <maya.desai@acmefintech.example>",
      status: "approval_required",
      requiresApproval: true,
      approvalReason:
        "External customer communication includes SOC2 sharing terms, migration estimates, and pricing confirmation.",
      sourceIds: [
        "src-gmail-acme-soc2",
        "src-gmail-acme-migration-pricing",
        "src-calendar-acme-demo",
        "src-crm-acme-opportunity",
        "src-doc-soc2-one-pager",
        "src-doc-migration-plan",
        "src-doc-pricing-faq",
      ],
      body: `To: Maya Desai <maya.desai@acmefintech.example>
Subject: Follow-up from yesterday's demo

Hi Maya,

Thank you for joining yesterday's demo with Raj. I prepared the follow-up items your team requested so Acme can continue technical validation.

SOC2: We can provide the SOC2 Type II security one-pager for review. The full audit report requires NDA confirmation before it can be shared.

Migration timeline: Based on the 18 active workflows discussed in the demo, the grounded estimate is four to six weeks. The plan starts with workflow inventory and connector mapping, then moves through a pilot workspace, approval policy review, UAT, and staged rollout.

Pricing: The CRM record reflects a $48k ARR opportunity aligned to the current enterprise quote. Any discount or concession should be confirmed with finance before proposal language is finalized.

Prepared next steps:
1. Confirm NDA status for the full SOC2 report.
2. Share the migration plan and SOC2 one-pager after approval.
3. Prepare a 30-minute follow-up with security, RevOps, Jamie, and Alex.

Would Tuesday or Wednesday afternoon work for your team?

Best,
Jamie`,
    },
    {
      id: "draft-crm-next-steps",
      type: "crm",
      title: "CRM update draft",
      summary:
        "Prepared CRM next steps for technical validation, security review, pricing approval, and stakeholder follow-up.",
      targetTool: "crm",
      status: "approval_required",
      requiresApproval: true,
      approvalReason:
        "CRM field and note changes affect pipeline reporting, next-step ownership, and forecast quality.",
      sourceIds: [
        "src-crm-acme-opportunity",
        "src-gmail-acme-migration-pricing",
        "src-calendar-acme-demo",
        "src-slack-acme-security-migration",
        "src-slack-acme-pricing",
      ],
      body: `Opportunity: Acme Fintech
ARR potential: $48k
Stage: Technical validation
Risk: Security review
Decision maker: Maya Desai, VP Operations

Prepared CRM draft:
- Add post-demo note covering SOC2, migration timeline, pricing confirmation, and requested follow-up.
- Set proposed next step to "Send security one-pager, migration plan, and pricing confirmation after approval."
- Add a follow-up task draft for Jamie Lee to coordinate a 30-minute security and RevOps review.
- Keep risk at "security review" until NDA status and SOC2 report-sharing path are confirmed.
- Add pricing approval reminder before any discount language is included in a proposal.`,
    },
    {
      id: "draft-slack-internal-update",
      type: "slack",
      title: "Internal Slack update draft",
      summary:
        "Prepared internal update summarizing customer asks, source-backed guidance, owners, and approval requirements.",
      targetTool: "slack",
      status: "approval_required",
      requiresApproval: true,
      approvalReason:
        "Internal coordination references deal strategy, pricing posture, and security review handling.",
      sourceIds: [
        "src-slack-acme-security-migration",
        "src-slack-acme-pricing",
        "src-calendar-acme-demo",
        "src-crm-acme-opportunity",
        "src-doc-pricing-faq",
      ],
      body: `Channel: #deal-acme-fintech

Prepared internal update:

Acme Fintech post-demo follow-up is ready for review.

Customer asks:
- SOC2 Type II one-pager now; full report once NDA status is confirmed.
- Migration estimate for 18 active workflows from their legacy workflow tool.
- Confirmation of the current $48k ARR enterprise pricing path.
- Follow-up with security and RevOps stakeholders.

Recommended owner split:
- Jamie: customer follow-up and CRM next-step draft.
- Alex: validate four-to-six week migration estimate and join follow-up.
- Priya: review pricing language before customer-facing copy includes discount flexibility.

Approval required before using this with the customer or applying workspace changes.`,
    },
    {
      id: "draft-calendar-follow-up",
      type: "calendar",
      title: "Calendar follow-up draft",
      summary:
        "Prepared 30-minute security and migration follow-up draft with suggested attendees and agenda.",
      targetTool: "calendar",
      status: "approval_required",
      requiresApproval: true,
      approvalReason:
        "Calendar coordination should wait for customer availability and internal owner approval.",
      sourceIds: [
        "src-gmail-acme-migration-pricing",
        "src-calendar-acme-demo",
        "src-crm-acme-opportunity",
      ],
      body: `Title: Acme Fintech security and migration follow-up
Duration: 30 minutes
Suggested window: Tuesday or Wednesday afternoon
Proposed attendees: Maya Desai, Raj Mehta, Jamie Lee, Alex Kim

Agenda:
1. Confirm SOC2 report-sharing path and NDA status.
2. Review four-to-six week migration plan and owner responsibilities.
3. Confirm pricing proposal path and finance approval requirement.
4. Align on technical validation next steps and decision timeline.`,
    },
  ];
}
