## Project Name

Agent Workflow Lab

## One-line Pitch

Agent Workflow Lab tests AI agent workflows against a realistic seeded workplace before connecting real tools.

## What We Are Building

This is a workflow testing lab for AI WorkOS teams.

A user enters a messy workplace request.

The app converts it into:
1. structured workflow
2. connector searches across seeded workplace data
3. trace timeline
4. draft actions
5. eval/safety report

## Important Positioning

This is NOT a chatbot.
This is NOT a Libra clone.
This is NOT random dummy mock data.

This is a seeded demo workspace for testing agent workflows.

The UI must clearly show:

"Demo workspace: seeded workplace data"

## Core Demo Request

Use this as the main demo:

"A customer asked about SOC2, migration timeline, pricing, and wants a follow-up after yesterday’s demo. Find the right context, prepare a follow-up email, create CRM next steps, draft an internal Slack update, and schedule a follow-up. Ask for approval before taking action."

## Seeded Workspace Data

The demo workspace should include:

1. Gmail-like customer emails
   - SOC2 request
   - migration timeline question
   - pricing discussion
   - follow-up request

2. Calendar-like meeting data
   - demo meeting happened yesterday
   - attendees
   - meeting notes
   - next meeting suggestion

3. CRM-like deal data
   - company name
   - ARR potential
   - deal stage
   - risk
   - decision maker
   - next step

4. Slack-like internal discussion
   - security objection
   - pricing strategy
   - migration concern
   - founder/AE/engineer comments

5. Docs-like knowledge base
   - SOC2 security one-pager
   - migration plan
   - pricing FAQ
   - onboarding checklist

## MVP Core Flow

Messy request
→ workflow compiled
→ seeded workspace searched
→ sources retrieved
→ draft actions created
→ trace shown
→ eval report generated

## MVP Actions

All actions must be drafts only:

- customer follow-up email draft
- CRM update draft
- internal Slack update draft
- calendar follow-up draft

Never say:
- sent email
- posted Slack message
- created calendar event
- updated CRM

Always say:
- drafted email
- prepared Slack update
- prepared calendar draft
- prepared CRM update
- approval required

## UI Style

Use a serious product/infrastructure style:

- Linear
- Vercel
- OpenAI dashboard
- WorkOS
- Raycast

Rules:

- minimal
- neutral colors
- clean cards
- good spacing
- badges for tools
- timeline for trace
- no childish gradients
- no chatbot interface

## Phase 0 Scope

Only build static UI.

No AI.
No backend.
No database.
No OAuth.
No real integrations.

Routes:

- `/` landing page
- `/app` main demo page

## Phase 0 Components

Create:

- Hero
- HowItWorks
- WorkflowInput
- WorkflowSummary
- WorkspaceSourceCard
- ToolStepTimeline
- TraceTimeline
- DraftActionCard
- EvalPanel
- JsonInspector

## Folder Structure

Use:

src/
  app/
    page.tsx
    app/
      page.tsx

  components/
    landing/
    lab/

  lib/
    types.ts
    demo-data.ts