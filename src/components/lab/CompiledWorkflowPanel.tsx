"use client";

import { Badge } from "@/components/ui/badge";
import type { CompiledWorkflow } from "@/lib/compiler-schema";

const toolBadgeClass: Record<string, string> = {
  gmail: "tool-bg-gmail",
  calendar: "tool-bg-calendar",
  crm: "tool-bg-crm",
  slack: "tool-bg-slack",
  docs: "tool-bg-docs",
};

interface CompiledWorkflowPanelProps {
  workflow: CompiledWorkflow;
}

export function CompiledWorkflowPanel({ workflow }: CompiledWorkflowPanelProps) {
  return (
    <div className="rounded-xl border-l-2 border-l-blue-500/60 border border-zinc-200 bg-white p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-zinc-900">Compiled Workflow</h2>
          <Badge className="text-[10px] font-mono bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50">
            AI Plan
          </Badge>
        </div>
        <Badge
          variant="outline"
          className={
            workflow.riskLevel === "high"
              ? "border-rose-300 bg-rose-50 text-rose-700"
              : workflow.riskLevel === "medium"
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
          }
        >
          {workflow.riskLevel} risk
        </Badge>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-medium text-zinc-900">{workflow.title}</h3>
        <p className="text-sm text-zinc-500">{workflow.summary}</p>
      </div>

      {/* Meta fields */}
      <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-zinc-50/80 border border-zinc-100 p-4">
        <Field label="Intent" value={workflow.intent} />
        <Field label="Department" value={workflow.department} />
        <Field label="Persona" value={workflow.persona} />
        <Field label="Automation Potential" value={workflow.automationPotential} />
        <Field label="Business Value" value={workflow.businessValue} />
      </div>

      {/* Tools */}
      <div className="space-y-2">
        <span className="text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-wider">Tools</span>
        <div className="flex flex-wrap gap-1.5">
          {workflow.tools.map((tool) => (
            <Badge key={tool} variant="secondary" className={`text-[10px] font-medium ${toolBadgeClass[tool] ?? ""}`}>
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      {/* Generated search queries */}
      {workflow.generatedSearchQueries.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-wider">
            Generated Search Queries
          </span>
          <div className="space-y-1.5">
            {workflow.generatedSearchQueries.map((q) => (
              <div key={q.id} className="flex items-start gap-2 rounded-md bg-zinc-50 border border-zinc-100 px-3 py-2">
                <Badge variant="secondary" className={`shrink-0 text-[10px] mt-0.5 ${toolBadgeClass[q.tool] ?? ""}`}>
                  {q.tool}
                </Badge>
                <div className="min-w-0">
                  <code className="text-xs font-mono text-zinc-700">{q.query}</code>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{q.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approval gates */}
      {workflow.approvalGates.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-wider">
            Approval Gates
          </span>
          <div className="space-y-1.5">
            {workflow.approvalGates.map((gate) => (
              <div key={gate.id} className="flex items-start gap-2 rounded-md border-l-2 border-l-amber-400 bg-amber-50/50 border border-amber-200/60 px-3 py-2">
                <div className="min-w-0">
                  <span className="text-xs font-medium text-zinc-800">{gate.title}</span>
                  <p className="text-xs text-zinc-500 mt-0.5">{gate.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing info */}
      {workflow.missingInfo.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-wider">
            Missing Info
          </span>
          <ul className="space-y-1">
            {workflow.missingInfo.map((info, i) => (
              <li key={i} className="text-xs text-zinc-500 flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                {info}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {workflow.assumptions.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-wider">
            Assumptions
          </span>
          <ul className="space-y-1">
            {workflow.assumptions.map((assumption, i) => (
              <li key={i} className="text-xs text-zinc-500 flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-300 shrink-0" />
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workflow steps */}
      {workflow.steps.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-wider">
            Workflow Steps ({workflow.steps.length})
          </span>
          <ol className="space-y-2">
            {workflow.steps.map((step, i) => (
              <li
                key={step.id}
                className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-medium font-mono text-white">
                  {i + 1}
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-zinc-800">{step.title}</span>
                    <Badge variant="outline" className="text-[10px] border-zinc-200 text-zinc-500">
                      {step.type}
                    </Badge>
                    {step.tool && (
                      <Badge variant="secondary" className={`text-[10px] ${toolBadgeClass[step.tool] ?? ""}`}>
                        {step.tool}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <span className="text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-wider">{label}</span>
      <p className="text-sm text-zinc-800">{value}</p>
    </div>
  );
}
