"use client";

import { Badge } from "@/components/ui/badge";
import type { CompiledWorkflow } from "@/lib/compiler-schema";

interface CompiledWorkflowPanelProps {
  workflow: CompiledWorkflow;
}

export function CompiledWorkflowPanel({ workflow }: CompiledWorkflowPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border/60 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Compiled Workflow</h2>
        <Badge
          variant="outline"
          className={
            workflow.riskLevel === "high"
              ? "border-red-300 text-red-700"
              : workflow.riskLevel === "medium"
                ? "border-yellow-300 text-yellow-700"
                : "border-green-300 text-green-700"
          }
        >
          {workflow.riskLevel} risk
        </Badge>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-medium">{workflow.title}</h3>
        <p className="text-sm text-muted-foreground">{workflow.summary}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Intent" value={workflow.intent} />
        <Field label="Department" value={workflow.department} />
        <Field label="Persona" value={workflow.persona} />
        <Field label="Automation Potential" value={workflow.automationPotential} />
        <Field label="Business Value" value={workflow.businessValue} />
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Tools</span>
        <div className="flex flex-wrap gap-1.5">
          {workflow.tools.map((tool) => (
            <Badge key={tool} variant="secondary" className="text-xs">
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      {workflow.generatedSearchQueries.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Generated Search Queries
          </span>
          <ul className="space-y-1">
            {workflow.generatedSearchQueries.map((q) => (
              <li key={q.id} className="text-xs text-muted-foreground">
                <Badge variant="outline" className="mr-1.5 text-[10px]">
                  {q.tool}
                </Badge>
                {q.query}
                <span className="ml-1 text-muted-foreground/60">— {q.purpose}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {workflow.approvalGates.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Approval Gates
          </span>
          <ul className="space-y-1">
            {workflow.approvalGates.map((gate) => (
              <li key={gate.id} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{gate.title}</span>
                {" — "}
                {gate.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {workflow.missingInfo.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Missing Info
          </span>
          <ul className="list-disc list-inside space-y-0.5">
            {workflow.missingInfo.map((info, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                {info}
              </li>
            ))}
          </ul>
        </div>
      )}

      {workflow.assumptions.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Assumptions
          </span>
          <ul className="list-disc list-inside space-y-0.5">
            {workflow.assumptions.map((assumption, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      )}

      {workflow.steps.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Workflow Steps ({workflow.steps.length})
          </span>
          <ol className="space-y-2">
            {workflow.steps.map((step, i) => (
              <li
                key={step.id}
                className="flex items-start gap-2 rounded border border-border/40 p-2"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  {i + 1}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium">{step.title}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {step.type}
                    </Badge>
                    {step.tool && (
                      <Badge variant="secondary" className="text-[10px]">
                        {step.tool}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
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
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className="text-sm">{value}</p>
    </div>
  );
}
