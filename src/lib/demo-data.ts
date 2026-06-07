import { runWorkflow } from "./runner";

export const DEMO_REQUEST =
  "A customer asked about SOC2, migration timeline, pricing, and wants a follow-up after yesterday's demo. Find the right context, prepare a follow-up email, create CRM next steps, draft an internal Slack update, and schedule a follow-up. Ask for approval before taking action.";

export const demoRun = runWorkflow(DEMO_REQUEST);

export const demoData = demoRun;
