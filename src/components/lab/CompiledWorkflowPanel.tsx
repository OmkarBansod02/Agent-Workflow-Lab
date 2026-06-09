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
    <div className="rounded-xl border-l-2 border-l-[#FF5A2A]/60 border border-white/[0.08] bg-[#1B1A18] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-semibold text-stone-100">Compiled Workflow</h2>
          <Badge className="text-[11px] font-mono bg-[#FF5A2A]/12 text-[#FF6A3D] border border-[#FF5A2A]/25 hover:bg-[#FF5A2A]/12">
            AI Plan
          </Badge>
        </div>
        <Badge
          variant="outline"
          className={
            workflow.riskLevel === "high"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
              : workflow.riskLevel === "medium"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }
        >
          {workflow.riskLevel} risk
        </Badge>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-medium text-stone-100">{workflow.title}</h3>
        <p className="text-sm text-[#A8A29E]">{workflow.summary}</p>
      </div>

      {/* Meta fields */}
      <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-[#201F1D] border border-white/[0.06] p-4">
        <Field label="Intent" value={workflow.intent} />
        <Field label="Department" value={workflow.department} />
        <Field label="Persona" value={workflow.persona} />
        <Field label="Automation Potential" value={workflow.automationPotential} />
        <Field label="Business Value" value={workflow.businessValue} />
      </div>

      {/* Tools */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium font-mono text-[#78716C] uppercase tracking-wider">Tools</span>
        <div className="flex flex-wrap gap-1.5">
          {workflow.tools.map((tool) => (
            <Badge key={tool} variant="secondary" className={`text-[11px] font-medium ${toolBadgeClass[tool] ?? ""}`}>
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      {/* Generated search queries */}
      {workflow.generatedSearchQueries.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-medium font-mono text-[#78716C] uppercase tracking-wider">
            Generated Search Queries
          </span>
          <div className="space-y-1.5">
            {workflow.generatedSearchQueries.map((q) => (
              <div key={q.id} className="flex items-start gap-2 rounded-md bg-[#201F1D] border border-white/[0.06] px-3 py-2">
                <Badge variant="secondary" className={`shrink-0 text-[11px] mt-0.5 ${toolBadgeClass[q.tool] ?? ""}`}>
                  {q.tool}
                </Badge>
                <div className="min-w-0">
                  <code className="text-[13px] font-mono text-stone-300">{q.query}</code>
                  <p className="text-[11px] text-[#78716C] mt-0.5">{q.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approval gates */}
      {workflow.approvalGates.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-medium font-mono text-[#78716C] uppercase tracking-wider">
            Approval Gates
          </span>
          <div className="space-y-1.5">
            {workflow.approvalGates.map((gate) => (
              <div key={gate.id} className="flex items-start gap-2 rounded-md border-l-2 border-l-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                <div className="min-w-0">
                  <span className="text-[13px] font-medium text-stone-200">{gate.title}</span>
                  <p className="text-[13px] text-[#A8A29E] mt-0.5">{gate.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing info */}
      {workflow.missingInfo.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-medium font-mono text-[#78716C] uppercase tracking-wider">
            Missing Info
          </span>
          <ul className="space-y-1">
            {workflow.missingInfo.map((info, i) => (
              <li key={i} className="text-[13px] text-[#A8A29E] flex items-start gap-2">
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
          <span className="text-[11px] font-medium font-mono text-[#78716C] uppercase tracking-wider">
            Assumptions
          </span>
          <ul className="space-y-1">
            {workflow.assumptions.map((assumption, i) => (
              <li key={i} className="text-[13px] text-[#A8A29E] flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-stone-600 shrink-0" />
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workflow steps */}
      {workflow.steps.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-medium font-mono text-[#78716C] uppercase tracking-wider">
            Workflow Steps ({workflow.steps.length})
          </span>
          <ol className="space-y-2">
            {workflow.steps.map((step, i) => (
              <li
                key={step.id}
                className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-[#201F1D] p-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF5A2A] text-[10px] font-medium font-mono text-white">
                  {i + 1}
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-medium text-stone-200">{step.title}</span>
                    <Badge variant="outline" className="text-[11px] border-white/[0.08] text-[#A8A29E]">
                      {step.type}
                    </Badge>
                    {step.tool && (
                      <Badge variant="secondary" className={`text-[11px] ${toolBadgeClass[step.tool] ?? ""}`}>
                        {step.tool}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[13px] text-[#78716C]">
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
      <span className="text-[11px] font-medium font-mono text-[#78716C] uppercase tracking-wider">{label}</span>
      <p className="text-sm text-stone-300">{value}</p>
    </div>
  );
}
