import type { DemoWorkspaceData } from "./types";

export const DEMO_REQUEST =
  "A customer asked about SOC2, migration timeline, pricing, and wants a follow-up after yesterday's demo. Find the right context, prepare a follow-up email, create CRM next steps, draft an internal Slack update, and schedule a follow-up. Ask for approval before taking action.";

export const demoData: DemoWorkspaceData = {
  workflowSummary: {
    request: DEMO_REQUEST,
    stepsCount: 7,
    sourcesFound: 8,
    actionsGenerated: 4,
    totalDurationMs: 3842,
    connectors: ["gmail", "calendar", "crm", "slack", "docs"],
  },

  steps: [
    {
      id: "step-1",
      label: "Search Gmail",
      description:
        "Retrieved 3 email threads from Acme Corp — SOC2 inquiry, pricing discussion, and demo follow-up request.",
      status: "completed",
      connector: "gmail",
      durationMs: 620,
    },
    {
      id: "step-2",
      label: "Search Calendar",
      description:
        "Found yesterday's demo meeting with Acme Corp. Attendees: Sarah Chen (VP Eng), Marcus Rivera (CTO), Jamie Lee (AE).",
      status: "completed",
      connector: "calendar",
      durationMs: 340,
    },
    {
      id: "step-3",
      label: "Lookup CRM",
      description:
        "Pulled deal record for Acme Corp — $185K ARR, Stage: Technical Evaluation, Risk: Medium, Decision Maker: Sarah Chen.",
      status: "completed",
      connector: "crm",
      durationMs: 410,
    },
    {
      id: "step-4",
      label: "Search Slack",
      description:
        "Found 4 relevant threads in #deals-acme — security objection discussion, pricing strategy alignment, migration timeline concerns.",
      status: "completed",
      connector: "slack",
      durationMs: 580,
    },
    {
      id: "step-5",
      label: "Search Docs",
      description:
        "Retrieved SOC2 security one-pager, migration playbook, and pricing FAQ from the knowledge base.",
      status: "completed",
      connector: "docs",
      durationMs: 290,
    },
    {
      id: "step-6",
      label: "Compile Context",
      description:
        "Merged sources from 5 connectors. Identified key concerns: SOC2 compliance timeline, data migration SLA, enterprise pricing tier.",
      status: "completed",
      connector: "docs",
      durationMs: 820,
    },
    {
      id: "step-7",
      label: "Generate Drafts",
      description:
        "Created 4 draft actions: follow-up email, CRM update, Slack summary, and calendar invite. All pending approval.",
      status: "completed",
      connector: "docs",
      durationMs: 782,
    },
  ],

  sources: [
    {
      id: "src-1",
      connector: "gmail",
      title: "RE: SOC2 Compliance Requirements",
      summary:
        "Sarah Chen asked about SOC2 Type II certification timeline and whether audit reports can be shared under NDA. Mentioned their compliance team needs documentation before procurement sign-off.",
      timestamp: "2025-06-05T14:23:00Z",
      relevance: 0.96,
      metadata: {
        from: "sarah.chen@acmecorp.com",
        to: "jamie.lee@company.com",
        thread: "3 messages",
      },
    },
    {
      id: "src-2",
      connector: "gmail",
      title: "Pricing Discussion — Enterprise Tier",
      summary:
        "Marcus Rivera requested a breakdown of enterprise vs. growth tier pricing. Specifically asked about volume discounts for 500+ seats and multi-year commitment options.",
      timestamp: "2025-06-04T10:15:00Z",
      relevance: 0.91,
      metadata: {
        from: "marcus.rivera@acmecorp.com",
        to: "jamie.lee@company.com",
        thread: "5 messages",
      },
    },
    {
      id: "src-3",
      connector: "gmail",
      title: "Follow-up Request After Demo",
      summary:
        "Sarah Chen thanked the team for yesterday's demo and requested a follow-up with migration timeline details and next steps for a technical deep-dive.",
      timestamp: "2025-06-06T09:42:00Z",
      relevance: 0.98,
      metadata: {
        from: "sarah.chen@acmecorp.com",
        to: "jamie.lee@company.com",
        thread: "1 message",
      },
    },
    {
      id: "src-4",
      connector: "calendar",
      title: "Acme Corp — Product Demo",
      summary:
        "60-minute product demo held yesterday. Covered core platform capabilities, integration architecture, and security overview. Sarah asked about migration from legacy system.",
      timestamp: "2025-06-05T15:00:00Z",
      relevance: 0.94,
      metadata: {
        attendees: "Sarah Chen, Marcus Rivera, Jamie Lee, Alex Patel",
        duration: "60 min",
        location: "Zoom",
      },
    },
    {
      id: "src-5",
      connector: "crm",
      title: "Acme Corp — Deal Record",
      summary:
        "Enterprise deal in Technical Evaluation stage. $185K ARR potential. Medium risk due to competitor evaluation (Competitor X). Decision maker: Sarah Chen, VP Engineering.",
      timestamp: "2025-06-06T08:00:00Z",
      relevance: 0.93,
      metadata: {
        stage: "Technical Evaluation",
        arr: "$185,000",
        risk: "Medium",
        nextStep: "Send SOC2 docs + migration plan",
      },
    },
    {
      id: "src-6",
      connector: "slack",
      title: "#deals-acme — Security Objection Thread",
      summary:
        "Alex Patel (Engineer): 'Their security team is thorough — they'll want pen test results alongside SOC2.' Jamie Lee (AE): 'Sarah mentioned they need this before legal review.' Priya Sharma (Founder): 'Fast-track the SOC2 summary. This is a priority deal.'",
      timestamp: "2025-06-05T16:30:00Z",
      relevance: 0.89,
      metadata: {
        channel: "#deals-acme",
        participants: "3",
        messages: "12",
      },
    },
    {
      id: "src-7",
      connector: "slack",
      title: "#deals-acme — Pricing & Migration",
      summary:
        "Jamie Lee: 'Marcus wants enterprise pricing for 500 seats with 3-year option.' Priya Sharma: 'We can do 15% multi-year discount. Check with finance.' Alex Patel: 'Migration from their legacy stack is ~6 weeks with dedicated support.'",
      timestamp: "2025-06-05T17:15:00Z",
      relevance: 0.87,
      metadata: {
        channel: "#deals-acme",
        participants: "3",
        messages: "8",
      },
    },
    {
      id: "src-8",
      connector: "docs",
      title: "SOC2 Type II — Security One-Pager",
      summary:
        "Internal document covering SOC2 Type II certification status, audit timeline, available reports, and NDA-sharing policy. Last updated this quarter.",
      timestamp: "2025-05-20T12:00:00Z",
      relevance: 0.85,
      metadata: {
        type: "Knowledge Base",
        lastUpdated: "2025-05-20",
        owner: "Security Team",
      },
    },
  ],

  trace: [
    {
      id: "trace-1",
      timestamp: "2025-06-06T10:00:00.000Z",
      type: "analyze",
      label: "Parse request",
      detail:
        "Identified 5 intents: SOC2 info, migration timeline, pricing, follow-up email, CRM update.",
      durationMs: 120,
      status: "success",
    },
    {
      id: "trace-2",
      timestamp: "2025-06-06T10:00:00.120Z",
      type: "search",
      label: "Gmail search",
      detail:
        "Queried Gmail connector for threads matching 'Acme Corp SOC2 pricing migration'. Found 3 threads.",
      durationMs: 620,
      status: "success",
    },
    {
      id: "trace-3",
      timestamp: "2025-06-06T10:00:00.740Z",
      type: "search",
      label: "Calendar search",
      detail:
        "Queried Calendar connector for recent meetings with Acme Corp. Found 1 meeting (yesterday).",
      durationMs: 340,
      status: "success",
    },
    {
      id: "trace-4",
      timestamp: "2025-06-06T10:00:01.080Z",
      type: "retrieve",
      label: "CRM lookup",
      detail:
        "Retrieved deal record for Acme Corp. Stage: Technical Evaluation, ARR: $185K.",
      durationMs: 410,
      status: "success",
    },
    {
      id: "trace-5",
      timestamp: "2025-06-06T10:00:01.490Z",
      type: "search",
      label: "Slack search",
      detail:
        "Searched #deals-acme channel. Found 4 relevant threads on security, pricing, migration.",
      durationMs: 580,
      status: "success",
    },
    {
      id: "trace-6",
      timestamp: "2025-06-06T10:00:02.070Z",
      type: "retrieve",
      label: "Docs retrieval",
      detail:
        "Retrieved 3 knowledge base documents: SOC2 one-pager, migration playbook, pricing FAQ.",
      durationMs: 290,
      status: "success",
    },
    {
      id: "trace-7",
      timestamp: "2025-06-06T10:00:02.360Z",
      type: "compile",
      label: "Context compilation",
      detail:
        "Merged 8 sources across 5 connectors. Resolved conflicts in pricing data. Ranked by relevance.",
      durationMs: 820,
      status: "success",
    },
    {
      id: "trace-8",
      timestamp: "2025-06-06T10:00:03.180Z",
      type: "draft",
      label: "Draft generation",
      detail:
        "Generated 4 draft actions: email, CRM update, Slack summary, calendar invite.",
      durationMs: 540,
      status: "success",
    },
    {
      id: "trace-9",
      timestamp: "2025-06-06T10:00:03.720Z",
      type: "eval",
      label: "Safety evaluation",
      detail:
        "Ran 6 eval checks. All passed. No PII leakage, tone appropriate, sources verified.",
      durationMs: 122,
      status: "success",
    },
  ],

  actions: [
    {
      id: "action-1",
      type: "email",
      title: "Follow-up Email to Sarah Chen",
      summary:
        "Drafted follow-up email addressing SOC2 documentation, migration timeline, enterprise pricing, and next steps.",
      body: `Hi Sarah,

Thank you for your time during yesterday's demo — great questions from you and Marcus.

Following up on the items discussed:

**SOC2 Compliance**
We hold SOC2 Type II certification. I've attached our security one-pager and can share the full audit report under NDA. Our compliance team can schedule a call with yours if that would be helpful.

**Migration Timeline**
Based on your current stack, we estimate a 6-week migration with dedicated engineering support. I've included our migration playbook for reference.

**Pricing**
For 500 seats on the Enterprise tier with a 3-year commitment, we can offer a 15% multi-year discount. I'll have a detailed proposal ready by end of week.

**Next Steps**
- Share SOC2 audit report (under NDA)
- Schedule technical deep-dive with your engineering team
- Send formal pricing proposal

Would Thursday or Friday work for a 30-minute follow-up? Happy to include anyone else from your team.

Best,
Jamie`,
      status: "draft",
      recipient: "sarah.chen@acmecorp.com",
      metadata: {
        connector: "Gmail",
        approvalRequired: "true",
      },
    },
    {
      id: "action-2",
      type: "crm",
      title: "Update Acme Corp Deal Record",
      summary:
        "Prepared CRM update: advance stage, log demo outcome, set next steps.",
      body: `Deal: Acme Corp
Stage: Technical Evaluation → Proposal Sent
Last Activity: Product Demo (June 5)
Next Step: Send SOC2 docs + pricing proposal by EOW
Notes: Sarah requested SOC2 audit report under NDA. Marcus wants enterprise pricing for 500 seats with 3-year option. Competitor evaluation in progress.
Risk: Medium (unchanged)
Follow-up: Thursday/Friday`,
      status: "draft",
      metadata: {
        connector: "CRM",
        field: "Deal Stage, Next Steps, Notes",
        approvalRequired: "true",
      },
    },
    {
      id: "action-3",
      type: "slack",
      title: "Internal Update — #deals-acme",
      summary:
        "Prepared Slack update summarizing demo outcome and next steps for the team.",
      body: `📋 **Acme Corp — Post-Demo Update**

Demo went well yesterday. Key takeaways:

• **SOC2**: Sarah needs audit report before legal review. Sharing under NDA — Priya approved fast-tracking the summary.
• **Pricing**: Marcus wants enterprise tier for 500 seats, 3-year commitment. Priya confirmed we can offer 15% multi-year discount.
• **Migration**: Estimated 6 weeks with dedicated support. Alex confirmed this based on their legacy stack.
• **Next steps**: Follow-up email sent to Sarah. Scheduling technical deep-dive for Thursday/Friday. Pricing proposal by EOW.

cc @jamie @alex @priya`,
      status: "draft",
      metadata: {
        connector: "Slack",
        channel: "#deals-acme",
        approvalRequired: "true",
      },
    },
    {
      id: "action-4",
      type: "calendar",
      title: "Schedule Follow-up — Acme Corp",
      summary:
        "Prepared calendar invite for a 30-minute technical deep-dive follow-up.",
      body: `Title: Acme Corp — Technical Deep-Dive Follow-up
Duration: 30 minutes
Suggested: Thursday June 12 or Friday June 13, 2:00 PM
Attendees: Sarah Chen, Marcus Rivera, Jamie Lee, Alex Patel
Agenda:
  1. SOC2 audit report walkthrough
  2. Migration plan review
  3. Enterprise pricing proposal
  4. Timeline to decision`,
      status: "draft",
      metadata: {
        connector: "Calendar",
        approvalRequired: "true",
      },
    },
  ],

  eval: {
    overallScore: 94,
    readiness: "ready",
    summary:
      "All draft actions passed safety and quality checks. Sources are verified, tone is professional, and no sensitive data was exposed. Ready for human review and approval.",
    checks: [
      {
        id: "eval-1",
        label: "Source Verification",
        status: "pass",
        detail:
          "All 8 sources verified against workspace data. No hallucinated references.",
        category: "accuracy",
      },
      {
        id: "eval-2",
        label: "PII Protection",
        status: "pass",
        detail:
          "No personal identifiable information exposed beyond business contact details already in CRM.",
        category: "safety",
      },
      {
        id: "eval-3",
        label: "Action Completeness",
        status: "pass",
        detail:
          "All 5 requested intents addressed: SOC2, migration, pricing, email follow-up, CRM update.",
        category: "completeness",
      },
      {
        id: "eval-4",
        label: "Tone Appropriateness",
        status: "pass",
        detail:
          "Email tone is professional and consultative. Appropriate for enterprise B2B context.",
        category: "tone",
      },
      {
        id: "eval-5",
        label: "Approval Gates",
        status: "pass",
        detail:
          "All 4 actions marked as drafts requiring approval. No auto-execution configured.",
        category: "compliance",
      },
      {
        id: "eval-6",
        label: "Pricing Accuracy",
        status: "warn",
        detail:
          "15% multi-year discount referenced from Slack discussion. Recommend confirming with finance before sending proposal.",
        category: "accuracy",
      },
    ],
  },
};
