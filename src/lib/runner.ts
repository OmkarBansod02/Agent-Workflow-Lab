import { evaluateRun } from "./eval";
import { searchWorkspace } from "./search";
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

export function runWorkflow(request: string): DemoRun {
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
