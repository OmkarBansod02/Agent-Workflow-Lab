import { z } from "zod";

export const compilerToolNameSchema = z.enum([
  "gmail",
  "slack",
  "crm",
  "docs",
  "calendar",
]);

export const compilerStepTypeSchema = z.enum([
  "trigger",
  "retrieve",
  "reason",
  "action",
  "approval",
  "eval",
]);

export const compilerRiskLevelSchema = z.enum(["low", "medium", "high"]);

export const compilerEvalCategorySchema = z.enum([
  "retrieval",
  "grounding",
  "approval",
  "missing-info",
  "readiness",
]);

export const compiledWorkflowStepSchema = z
  .object({
    id: z.string().min(1),
    type: compilerStepTypeSchema,
    title: z.string().min(1),
    description: z.string().min(1),
    tool: compilerToolNameSchema.optional(),
    goal: z.string().min(1),
    dependsOn: z.array(z.string().min(1)),
    requiresApproval: z.boolean(),
    riskLevel: compilerRiskLevelSchema,
  })
  .strict();

export const approvalGateSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    requiredForTools: z.array(compilerToolNameSchema).min(1),
    riskLevel: compilerRiskLevelSchema,
    reason: z.string().min(1),
  })
  .strict();

export const compilerEvalCheckSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    category: compilerEvalCategorySchema,
    description: z.string().min(1),
    riskLevel: compilerRiskLevelSchema,
  })
  .strict();

export const generatedSearchQuerySchema = z
  .object({
    id: z.string().min(1),
    tool: compilerToolNameSchema,
    query: z.string().min(1),
    purpose: z.string().min(1),
  })
  .strict();

export const compiledWorkflowSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    intent: z.string().min(1),
    department: z.string().min(1),
    persona: z.string().min(1),
    tools: z.array(compilerToolNameSchema).min(1),
    riskLevel: compilerRiskLevelSchema,
    automationPotential: z.string().min(1),
    businessValue: z.string().min(1),
    assumptions: z.array(z.string().min(1)),
    missingInfo: z.array(z.string().min(1)),
    steps: z.array(compiledWorkflowStepSchema).min(1),
    approvalGates: z.array(approvalGateSchema).min(1),
    evalChecks: z.array(compilerEvalCheckSchema).min(1),
    generatedSearchQueries: z.array(generatedSearchQuerySchema).min(1),
  })
  .strict();

export type CompilerToolName = z.infer<typeof compilerToolNameSchema>;
export type CompilerStepType = z.infer<typeof compilerStepTypeSchema>;
export type CompilerRiskLevel = z.infer<typeof compilerRiskLevelSchema>;
export type CompilerEvalCategory = z.infer<typeof compilerEvalCategorySchema>;
export type CompiledWorkflowStep = z.infer<typeof compiledWorkflowStepSchema>;
export type ApprovalGate = z.infer<typeof approvalGateSchema>;
export type CompilerEvalCheck = z.infer<typeof compilerEvalCheckSchema>;
export type GeneratedSearchQuery = z.infer<typeof generatedSearchQuerySchema>;
export type CompiledWorkflow = z.infer<typeof compiledWorkflowSchema>;
