import type { DemoRun } from "./types";

export const DEMO_REQUEST =
  "A customer asked about SOC2, migration timeline, pricing, and wants a follow-up after yesterday's demo. Find the right context, prepare a follow-up email, create CRM next steps, draft an internal Slack update, and schedule a follow-up. Ask for approval before taking action.";

const workflowSummary: DemoRun["workflowSummary"] = {
  title: "Acme Fintech post-demo follow-up workflow",
  department: "Sales Engineering",
  persona: "Enterprise AE with sales engineering support",
  riskLevel: "medium",
  automationPotential:
    "High for context retrieval and draft preparation; human approval required before any external or internal action.",
  businessValue:
    "Accelerates a security-sensitive technical validation deal by grounding follow-up work in email, calendar, CRM, Slack, and docs context.",
  tools: ["gmail", "calendar", "crm", "slack", "docs"],
  missingInfo: [
    "Whether the SOC2 Type II report NDA is already countersigned",
    "Finance approval for the proposed pricing structure",
    "Customer availability for the follow-up meeting",
  ],
  assumptions: [
    "Yesterday's demo refers to the Acme Fintech product demo on 2026-06-06",
    "The follow-up owner is Jamie Lee, the account executive on the deal",
    "Drafts should be prepared only and routed for approval before execution",
  ],
};

const workflowSteps: DemoRun["workflowSteps"] = [
  {
    id: "step-trigger",
    type: "trigger",
    title: "Parse messy workplace request",
    description:
      "Identify the customer, requested topics, required sources, draft actions, and approval requirement.",
    status: "completed",
    riskLevel: "medium",
    requiresApproval: false,
  },
  {
    id: "step-retrieve-gmail",
    type: "retrieve",
    title: "Retrieve customer email context",
    description:
      "Find Acme Fintech email threads covering SOC2, migration timeline, pricing confirmation, and follow-up expectations.",
    tool: "gmail",
    status: "completed",
    riskLevel: "low",
    requiresApproval: false,
  },
  {
    id: "step-retrieve-calendar",
    type: "retrieve",
    title: "Retrieve demo meeting notes",
    description:
      "Locate yesterday's demo, attendees, objections, technical notes, and suggested next meeting window.",
    tool: "calendar",
    status: "completed",
    riskLevel: "low",
    requiresApproval: false,
  },
  {
    id: "step-retrieve-crm",
    type: "retrieve",
    title: "Retrieve CRM deal record",
    description:
      "Confirm ARR potential, stage, risk, decision maker, and next step for the Acme Fintech opportunity.",
    tool: "crm",
    status: "completed",
    riskLevel: "low",
    requiresApproval: false,
  },
  {
    id: "step-retrieve-slack-docs",
    type: "retrieve",
    title: "Retrieve internal discussion and docs",
    description:
      "Collect Slack guidance from the AE, founder, and engineer plus SOC2, migration, and pricing knowledge base sources.",
    tool: "slack",
    status: "completed",
    riskLevel: "medium",
    requiresApproval: false,
  },
  {
    id: "step-reason",
    type: "reason",
    title: "Compile grounded workflow summary",
    description:
      "Resolve the customer's asks against retrieved sources and identify open approvals for security and pricing claims.",
    status: "completed",
    riskLevel: "medium",
    requiresApproval: false,
  },
  {
    id: "step-actions",
    type: "action",
    title: "Prepare draft actions",
    description:
      "Draft the customer follow-up email, CRM next steps, internal Slack update, and calendar follow-up without taking action.",
    status: "requires_approval",
    riskLevel: "medium",
    requiresApproval: true,
  },
  {
    id: "step-approval",
    type: "approval",
    title: "Hold all drafts for approval",
    description:
      "Require a human reviewer before any email, CRM, Slack, or calendar action can be carried out.",
    status: "requires_approval",
    riskLevel: "medium",
    requiresApproval: true,
  },
  {
    id: "step-eval",
    type: "eval",
    title: "Generate eval and safety report",
    description:
      "Score retrieval quality, grounding, approval coverage, missing information, and readiness.",
    status: "completed",
    riskLevel: "low",
    requiresApproval: false,
  },
];

const sources: DemoRun["sources"] = [
  {
    id: "src-gmail-acme-follow-up",
    tool: "gmail",
    title: "Acme Fintech follow-up: SOC2, migration, pricing, next steps",
    sourceType: "email_thread",
    author: "Maya Desai, VP Operations at Acme Fintech",
    timestamp: "2026-06-07T09:14:00+05:30",
    snippet:
      "Maya thanked the team for yesterday's demo and asked for the SOC2 Type II report under NDA, a practical migration timeline from their legacy workflow tool, confirmation of the quoted pricing, and recommended next steps before security review.",
    relevanceScore: 0.99,
    tags: ["customer-request", "soc2", "migration", "pricing", "follow-up"],
  },
  {
    id: "src-calendar-demo",
    tool: "calendar",
    title: "Product demo: Acme Fintech x Agent Workflow Lab",
    sourceType: "calendar_event",
    author: "Jamie Lee, Account Executive",
    timestamp: "2026-06-06T16:00:00+05:30",
    snippet:
      "60-minute demo with Maya Desai, Raj Mehta, Jamie Lee, Priya Raman, and Alex Kim. Notes: Acme liked approval-gated draft actions, asked whether SOC2 documentation can be shared this week, flagged migration risk for 18 active workflows, and suggested a 30-minute follow-up with security and RevOps.",
    relevanceScore: 0.95,
    tags: ["demo", "attendees", "meeting-notes", "follow-up"],
  },
  {
    id: "src-crm-acme-deal",
    tool: "crm",
    title: "Acme Fintech opportunity",
    sourceType: "crm_record",
    author: "Jamie Lee, Account Executive",
    timestamp: "2026-06-07T08:35:00+05:30",
    snippet:
      "Company: Acme Fintech. ARR potential: $48k. Stage: technical validation. Risk: security review. Decision maker: Maya Desai, VP Operations. Next step: send security and migration docs, then schedule stakeholder follow-up.",
    relevanceScore: 0.96,
    tags: ["deal", "$48k-arr", "technical-validation", "security-review"],
  },
  {
    id: "src-slack-acme-thread",
    tool: "slack",
    title: "#deal-acme-fintech: security, pricing, and migration plan",
    sourceType: "slack_thread",
    author: "Jamie Lee, Priya Raman, Alex Kim",
    timestamp: "2026-06-06T18:22:00+05:30",
    snippet:
      "Jamie noted Maya wants one clear follow-up. Priya said SOC2 summary can be shared now and the full report requires NDA confirmation. Alex estimated a four-to-six week migration if Acme assigns an admin owner. Priya approved holding the current $4k monthly quote but asked Jamie to confirm finance before offering concessions.",
    relevanceScore: 0.93,
    tags: ["internal-context", "security", "pricing-strategy", "migration-risk"],
  },
  {
    id: "src-doc-soc2-one-pager",
    tool: "docs",
    title: "SOC2 Type II security one-pager",
    sourceType: "knowledge_base_doc",
    author: "Security Team",
    timestamp: "2026-05-28T11:00:00+05:30",
    snippet:
      "Customer-safe summary of SOC2 Type II scope, control areas, data handling practices, subprocessor review, report-sharing process, and NDA requirement for the full audit report.",
    relevanceScore: 0.91,
    tags: ["soc2", "security", "customer-safe", "nda"],
  },
  {
    id: "src-doc-migration-plan",
    tool: "docs",
    title: "Migration plan for workflow automation customers",
    sourceType: "knowledge_base_doc",
    author: "Solutions Engineering",
    timestamp: "2026-05-31T15:30:00+05:30",
    snippet:
      "Standard migration plan: discovery, workflow inventory, pilot workspace, connector mapping, approval policy review, user acceptance testing, and staged rollout. Typical range is four to six weeks for 10-25 workflows with a named customer admin.",
    relevanceScore: 0.9,
    tags: ["migration", "implementation", "timeline", "solutions-engineering"],
  },
  {
    id: "src-doc-pricing-faq",
    tool: "docs",
    title: "Enterprise pricing FAQ",
    sourceType: "knowledge_base_doc",
    author: "Revenue Operations",
    timestamp: "2026-06-01T10:15:00+05:30",
    snippet:
      "Enterprise plans may be quoted monthly or annually. Discounts beyond standard annual terms require finance approval. Security review support and guided onboarding are included for technical validation opportunities above $40k ARR.",
    relevanceScore: 0.88,
    tags: ["pricing", "enterprise", "finance-approval", "revops"],
  },
];

const traceEvents: DemoRun["traceEvents"] = [
  {
    id: "trace-001",
    stepId: "step-trigger",
    type: "request_parsed",
    status: "success",
    title: "Request parsed into workflow intents",
    description:
      "Detected retrieval needs for Gmail, Calendar, CRM, Slack, and Docs plus four draft-only actions gated by approval.",
    timestamp: "2026-06-07T09:30:00+05:30",
  },
  {
    id: "trace-002",
    stepId: "step-retrieve-gmail",
    type: "connector_search",
    status: "success",
    title: "Gmail source retrieved",
    description:
      "Found the customer email asking about SOC2, migration timeline, pricing confirmation, and next steps after the demo.",
    tool: "gmail",
    sources: ["src-gmail-acme-follow-up"],
    timestamp: "2026-06-07T09:30:04+05:30",
  },
  {
    id: "trace-003",
    stepId: "step-retrieve-calendar",
    type: "source_retrieved",
    status: "success",
    title: "Calendar demo notes retrieved",
    description:
      "Confirmed the product demo happened on 2026-06-06 with customer stakeholders and internal owner notes.",
    tool: "calendar",
    sources: ["src-calendar-demo"],
    timestamp: "2026-06-07T09:30:07+05:30",
  },
  {
    id: "trace-004",
    stepId: "step-retrieve-crm",
    type: "source_retrieved",
    status: "success",
    title: "CRM deal record retrieved",
    description:
      "Confirmed Acme Fintech is a $48k ARR technical validation opportunity with security review as the primary risk.",
    tool: "crm",
    sources: ["src-crm-acme-deal"],
    timestamp: "2026-06-07T09:30:10+05:30",
  },
  {
    id: "trace-005",
    stepId: "step-retrieve-slack-docs",
    type: "connector_search",
    status: "success",
    title: "Slack and docs context retrieved",
    description:
      "Found internal guidance on SOC2, migration risk, pricing flexibility, and ownership plus three knowledge base documents.",
    tool: "slack",
    sources: [
      "src-slack-acme-thread",
      "src-doc-soc2-one-pager",
      "src-doc-migration-plan",
      "src-doc-pricing-faq",
    ],
    timestamp: "2026-06-07T09:30:16+05:30",
  },
  {
    id: "trace-006",
    stepId: "step-reason",
    type: "context_merged",
    status: "warning",
    title: "Context merged with approval-sensitive gaps",
    description:
      "Grounded the response plan and flagged NDA status, finance approval, and customer availability as unresolved items.",
    sources: sources.map((source) => source.id),
    timestamp: "2026-06-07T09:30:22+05:30",
  },
  {
    id: "trace-007",
    stepId: "step-actions",
    type: "draft_prepared",
    status: "success",
    title: "Four draft actions prepared",
    description:
      "Prepared email, CRM, Slack, and calendar drafts. No external or internal action was taken.",
    sources: sources.map((source) => source.id),
    timestamp: "2026-06-07T09:30:31+05:30",
  },
  {
    id: "trace-008",
    stepId: "step-approval",
    type: "approval_gate",
    status: "success",
    title: "Approval gate applied",
    description:
      "All draft actions require review because they include customer communication, CRM changes, internal coordination, or scheduling.",
    timestamp: "2026-06-07T09:30:33+05:30",
  },
  {
    id: "trace-009",
    stepId: "step-eval",
    type: "eval_completed",
    status: "success",
    title: "Eval report generated",
    description:
      "Retrieval, grounding, approval coverage, missing information, and readiness were scored for the prepared run.",
    timestamp: "2026-06-07T09:30:36+05:30",
  },
];

const draftActions: DemoRun["draftActions"] = [
  {
    id: "draft-email-customer-follow-up",
    type: "email_draft",
    title: "Customer follow-up email draft",
    targetTool: "gmail",
    requiresApproval: true,
    approvalReason:
      "External customer communication includes SOC2 sharing terms, migration estimates, and pricing confirmation.",
    sourceIds: [
      "src-gmail-acme-follow-up",
      "src-calendar-demo",
      "src-crm-acme-deal",
      "src-doc-soc2-one-pager",
      "src-doc-migration-plan",
      "src-doc-pricing-faq",
    ],
    body: `To: Maya Desai <maya.desai@acmefintech.example>
Subject: Follow-up from yesterday's demo

Hi Maya,

Thank you for joining yesterday's demo with Raj. I pulled together the follow-up items you requested so your team can continue technical validation.

SOC2: We can provide the SOC2 Type II security one-pager now. The full audit report can be shared under NDA once the agreement is confirmed.

Migration timeline: Based on the 18 active workflows discussed in the demo, the current estimate is a four-to-six week migration. The plan would start with workflow inventory and connector mapping, then move through a pilot workspace, approval policy review, UAT, and staged rollout.

Pricing: The CRM record reflects a $48k ARR opportunity, aligned to the current enterprise quote. Any discount or concession should be confirmed with finance before it is included in a formal proposal.

Recommended next steps:
1. Confirm NDA status for the full SOC2 report.
2. Share the migration plan and security one-pager with your security and RevOps stakeholders.
3. Schedule a 30-minute follow-up with security, RevOps, Jamie, and Alex to review implementation details.

Would Tuesday or Wednesday afternoon work for the follow-up?

Best,
Jamie`,
  },
  {
    id: "draft-crm-next-steps",
    type: "crm_update_draft",
    title: "CRM update draft",
    targetTool: "crm",
    requiresApproval: true,
    approvalReason:
      "CRM fields affect pipeline reporting, next-step ownership, and forecast quality.",
    sourceIds: [
      "src-crm-acme-deal",
      "src-gmail-acme-follow-up",
      "src-calendar-demo",
      "src-slack-acme-thread",
    ],
    body: `Opportunity: Acme Fintech
ARR potential: $48k
Stage: Technical validation
Risk: Security review
Decision maker: Maya Desai, VP Operations

Prepared CRM changes:
- Add post-demo note covering SOC2, migration timeline, pricing confirmation, and requested follow-up.
- Set next step to "Send security one-pager, migration plan, and pricing confirmation after approval."
- Add follow-up task for Jamie Lee to coordinate a 30-minute security and RevOps review.
- Keep risk at "security review" until NDA status and SOC2 report-sharing path are confirmed.
- Add pricing approval reminder before any discount language is included in a proposal.`,
  },
  {
    id: "draft-slack-internal-update",
    type: "slack_update_draft",
    title: "Internal Slack update draft",
    targetTool: "slack",
    requiresApproval: true,
    approvalReason:
      "Internal coordination references deal strategy, pricing posture, and security review handling.",
    sourceIds: [
      "src-slack-acme-thread",
      "src-calendar-demo",
      "src-crm-acme-deal",
      "src-doc-pricing-faq",
    ],
    body: `Channel: #deal-acme-fintech

Prepared update:

Acme Fintech post-demo follow-up is ready for review.

Customer asks:
- SOC2 Type II one-pager now; full report once NDA status is confirmed.
- Migration estimate for 18 active workflows from their legacy workflow tool.
- Confirmation of the current $48k ARR enterprise pricing path.
- Follow-up with security and RevOps stakeholders.

Recommended owner split:
- Jamie: customer follow-up and CRM next-step draft.
- Alex: validate four-to-six week migration estimate and join follow-up.
- Priya: review pricing language before anything customer-facing includes discount flexibility.

Approval required before sharing with the customer or making workspace changes.`,
  },
  {
    id: "draft-calendar-follow-up",
    type: "calendar_event_draft",
    title: "Calendar follow-up draft",
    targetTool: "calendar",
    requiresApproval: true,
    approvalReason:
      "Scheduling should wait for customer availability and internal owner approval.",
    sourceIds: [
      "src-gmail-acme-follow-up",
      "src-calendar-demo",
      "src-crm-acme-deal",
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

const evalReport: DemoRun["evalReport"] = {
  retrievalScore: 96,
  groundingScore: 94,
  approvalScore: 100,
  missingInfoScore: 82,
  readinessScore: 91,
  warnings: [
    "Full SOC2 audit report sharing depends on NDA confirmation.",
    "Pricing concessions require finance approval before customer-facing language is finalized.",
    "Follow-up meeting time is a proposed window until the customer confirms availability.",
  ],
  recommendations: [
    "Route the email draft to the AE and security owner before sharing externally.",
    "Confirm finance guidance before adding discount terms to the pricing proposal.",
    "Attach the SOC2 one-pager and migration plan only after approval.",
    "Keep all four actions in draft state until the reviewer approves the run.",
  ],
};

export const demoRun: DemoRun = {
  request: DEMO_REQUEST,
  workflowSummary,
  workflowSteps,
  sources,
  traceEvents,
  draftActions,
  evalReport,
  rawJson: {
    request: DEMO_REQUEST,
    workflowSummary,
    workflowSteps,
    sources,
    traceEvents,
    draftActions,
    evalReport,
  },
};

export const demoData = demoRun;
