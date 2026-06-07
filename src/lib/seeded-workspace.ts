import type { WorkspaceSource } from "./types";

export const SEEDED_WORKSPACE: WorkspaceSource[] = [
  {
    id: "src-gmail-acme-soc2",
    tool: "gmail",
    connector: "gmail",
    title: "Acme Fintech SOC2 and security review request",
    sourceType: "email_thread",
    author: "Maya Desai, VP Operations at Acme Fintech",
    timestamp: "2026-06-07T09:14:00+05:30",
    snippet:
      "Maya thanked the team for yesterday's demo and asked for the SOC2 Type II report under NDA before Acme's security review.",
    summary:
      "Customer email requesting SOC2 Type II context and NDA-gated report sharing after the demo.",
    content:
      "Hi Jamie, thanks for yesterday's demo. Before we move forward with technical validation, can you send the SOC2 Type II security one-pager and explain how we can access the full report under NDA? Raj will use this for the security review.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["acme", "customer-request", "soc2", "security", "nda", "follow-up"],
    metadata: {
      from: "maya.desai@acmefintech.example",
      thread: "customer-email",
    },
  },
  {
    id: "src-gmail-acme-migration-pricing",
    tool: "gmail",
    connector: "gmail",
    title: "Acme Fintech migration timeline, pricing, and follow-up",
    sourceType: "email_thread",
    author: "Maya Desai, VP Operations at Acme Fintech",
    timestamp: "2026-06-07T09:22:00+05:30",
    snippet:
      "Maya asked for a practical migration timeline for 18 workflows, confirmation of pricing, and a follow-up with security and RevOps.",
    summary:
      "Customer follow-up request covering migration timeline, pricing confirmation, and next meeting coordination.",
    content:
      "Can you also confirm the migration timeline for our 18 active workflows from the legacy workflow tool? The $48k ARR pricing looked aligned with our budget, but please confirm any approval needed before sending a proposal. We would like a follow-up with security and RevOps after yesterday's demo.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["acme", "migration", "timeline", "pricing", "follow-up", "revops"],
    metadata: {
      from: "maya.desai@acmefintech.example",
      thread: "customer-email",
    },
  },
  {
    id: "src-calendar-acme-demo",
    tool: "calendar",
    connector: "calendar",
    title: "Product demo: Acme Fintech x Agent Workflow Lab",
    sourceType: "calendar_event",
    author: "Jamie Lee, Account Executive",
    timestamp: "2026-06-06T16:00:00+05:30",
    snippet:
      "Yesterday's 60-minute demo included Maya Desai, Raj Mehta, Jamie Lee, Priya Raman, and Alex Kim. Notes mention SOC2, 18 workflow migration risk, pricing, and a 30-minute follow-up.",
    summary:
      "Calendar event confirming yesterday's demo, attendees, meeting notes, and suggested follow-up format.",
    content:
      "Demo notes: Acme liked approval-gated draft actions. Maya asked whether SOC2 documentation can be shared this week. Raj flagged migration risk for 18 active workflows. Pricing was discussed at $48k ARR. Suggested next meeting: 30-minute follow-up with security and RevOps. Attendees: Maya Desai, Raj Mehta, Jamie Lee, Priya Raman, Alex Kim.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["acme", "demo", "yesterday", "attendees", "meeting-notes", "follow-up"],
    metadata: {
      date: "2026-06-06",
      duration: "60m",
    },
  },
  {
    id: "src-crm-acme-opportunity",
    tool: "crm",
    connector: "crm",
    title: "Acme Fintech opportunity",
    sourceType: "crm_record",
    author: "Jamie Lee, Account Executive",
    timestamp: "2026-06-07T08:35:00+05:30",
    snippet:
      "Company: Acme Fintech. ARR potential: $48k. Stage: technical validation. Risk: security review. Decision maker: Maya Desai. Next step: send security and migration docs, then schedule stakeholder follow-up.",
    summary:
      "CRM deal record with ARR, stage, risk, decision maker, and next step.",
    content:
      "Opportunity record: Acme Fintech. ARR potential $48k. Stage technical validation. Risk security review. Decision maker Maya Desai, VP Operations. Next step is to prepare security one-pager, migration plan, pricing confirmation, and stakeholder follow-up for approval.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["acme", "deal", "48k-arr", "technical-validation", "security-review"],
    metadata: {
      arr: "$48k",
      stage: "Technical validation",
      risk: "Security review",
    },
  },
  {
    id: "src-slack-acme-security-migration",
    tool: "slack",
    connector: "slack",
    title: "#deal-acme-fintech: SOC2 and migration guidance",
    sourceType: "slack_thread",
    author: "Jamie Lee, Priya Raman, Alex Kim",
    timestamp: "2026-06-06T18:22:00+05:30",
    snippet:
      "Priya said the SOC2 summary can be shared now and the full report requires NDA confirmation. Alex estimated four to six weeks for migration if Acme assigns an admin owner.",
    summary:
      "Internal Slack thread grounding security and migration guidance for the Acme follow-up.",
    content:
      "Jamie: Maya wants one clear follow-up. Priya: Share the customer-safe SOC2 summary now; full report only after NDA confirmation. Alex: For 18 workflows, estimate four to six weeks if Acme assigns an admin owner and we do connector mapping early.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["acme", "slack", "soc2", "security", "migration", "engineer"],
    metadata: {
      channel: "#deal-acme-fintech",
      participants: "AE, founder, engineer",
    },
  },
  {
    id: "src-slack-acme-pricing",
    tool: "slack",
    connector: "slack",
    title: "#deal-acme-fintech: pricing strategy",
    sourceType: "slack_thread",
    author: "Jamie Lee, Priya Raman",
    timestamp: "2026-06-06T18:41:00+05:30",
    snippet:
      "Priya approved holding the current $4k monthly quote but asked Jamie to confirm finance before offering concessions or discount language.",
    summary:
      "Internal pricing discussion requiring finance approval before customer-facing concessions.",
    content:
      "Jamie: Acme asked whether the $48k ARR path is firm. Priya: Hold the $4k monthly enterprise quote. Do not offer concessions in the customer email until finance approves any discount or non-standard term.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["acme", "pricing", "finance-approval", "discount", "founder"],
    metadata: {
      channel: "#deal-acme-fintech",
      topic: "pricing strategy",
    },
  },
  {
    id: "src-doc-soc2-one-pager",
    tool: "docs",
    connector: "docs",
    title: "SOC2 Type II security one-pager",
    sourceType: "knowledge_base_doc",
    author: "Security Team",
    timestamp: "2026-05-28T11:00:00+05:30",
    snippet:
      "Customer-safe SOC2 Type II summary covering scope, controls, data handling, subprocessors, and NDA process for the full report.",
    summary:
      "Approved customer-safe source for SOC2 positioning and full report access requirements.",
    content:
      "Use this one-pager for customer-safe SOC2 Type II security summaries. It covers control areas, data handling practices, subprocessor review, access controls, incident response, and report-sharing process. The full audit report requires a countersigned NDA.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["soc2", "security", "customer-safe", "nda", "knowledge-base"],
    metadata: {
      owner: "Security",
      policy: "Customer-safe",
    },
  },
  {
    id: "src-doc-migration-plan",
    tool: "docs",
    connector: "docs",
    title: "Migration plan for workflow automation customers",
    sourceType: "knowledge_base_doc",
    author: "Solutions Engineering",
    timestamp: "2026-05-31T15:30:00+05:30",
    snippet:
      "Standard migration plan includes discovery, workflow inventory, connector mapping, pilot workspace, UAT, and staged rollout. Typical range is four to six weeks for 10-25 workflows.",
    summary:
      "Knowledge base migration plan used to ground the Acme timeline estimate.",
    content:
      "Migration plan: discovery, workflow inventory, pilot workspace, connector mapping, approval policy review, user acceptance testing, and staged rollout. Typical timeline is four to six weeks for 10 to 25 workflows when the customer assigns a named admin owner.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["migration", "timeline", "implementation", "onboarding"],
    metadata: {
      owner: "Solutions Engineering",
      range: "4-6 weeks",
    },
  },
  {
    id: "src-doc-pricing-faq",
    tool: "docs",
    connector: "docs",
    title: "Enterprise pricing FAQ",
    sourceType: "knowledge_base_doc",
    author: "Revenue Operations",
    timestamp: "2026-06-01T10:15:00+05:30",
    snippet:
      "Enterprise plans may be quoted monthly or annually. Discounts beyond standard annual terms require finance approval.",
    summary:
      "Pricing FAQ grounding quote language and approval requirements for concessions.",
    content:
      "Enterprise pricing can be quoted monthly or annually. Discounts beyond standard annual terms require finance approval. Security review support and guided onboarding are included for technical validation opportunities above $40k ARR.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["pricing", "enterprise", "finance-approval", "revops"],
    metadata: {
      owner: "Revenue Operations",
      approval: "Finance required for concessions",
    },
  },
  {
    id: "src-doc-onboarding-checklist",
    tool: "docs",
    connector: "docs",
    title: "Enterprise onboarding checklist",
    sourceType: "knowledge_base_doc",
    author: "Customer Success",
    timestamp: "2026-05-24T13:20:00+05:30",
    snippet:
      "Checklist for onboarding enterprise customers, including admin owner assignment, security review, pilot workspace, approval policy mapping, and stakeholder kickoff.",
    summary:
      "Onboarding checklist that supports next-step planning for Acme technical validation.",
    content:
      "Enterprise onboarding requires a named admin owner, security review tracking, pilot workspace setup, connector access review, approval policy mapping, stakeholder kickoff, and staged rollout plan.",
    relevanceScore: 0,
    relevance: 0,
    tags: ["onboarding", "implementation", "security-review", "pilot"],
    metadata: {
      owner: "Customer Success",
      phase: "Onboarding",
    },
  },
];
