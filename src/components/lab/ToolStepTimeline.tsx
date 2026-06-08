import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowStep, ConnectorType } from "@/lib/types";

const connectorLabels: Record<ConnectorType, string> = {
  gmail: "Gmail",
  calendar: "Calendar",
  crm: "CRM",
  slack: "Slack",
  docs: "Docs",
};

const connectorDotClass: Record<ConnectorType, string> = {
  gmail: "bg-rose-500",
  calendar: "bg-blue-500",
  crm: "bg-violet-500",
  slack: "bg-amber-500",
  docs: "bg-emerald-500",
};

const connectorBadgeClass: Record<ConnectorType, string> = {
  gmail: "tool-bg-gmail",
  calendar: "tool-bg-calendar",
  crm: "tool-bg-crm",
  slack: "tool-bg-slack",
  docs: "tool-bg-docs",
};

interface ToolStepTimelineProps {
  steps: WorkflowStep[];
}

export function ToolStepTimeline({ steps }: ToolStepTimelineProps) {
  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-zinc-900">Tool Step Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {steps.map((step, i) => (
            <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {i < steps.length - 1 && (
                <div className="absolute left-[11px] top-6 h-full w-px bg-zinc-200" />
              )}
              <div className={`relative z-10 mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full ${connectorDotClass[step.connector]} ring-2 ring-white`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-800">{step.label}</span>
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${connectorBadgeClass[step.connector]}`}>
                    {connectorLabels[step.connector]}
                  </Badge>
                  <span className="ml-auto text-[10px] text-zinc-400 font-mono tabular-nums">
                    {step.durationMs}ms
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
