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

interface ToolStepTimelineProps {
  steps: WorkflowStep[];
}

export function ToolStepTimeline({ steps }: ToolStepTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tool Step Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {steps.map((step, i) => (
            <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* vertical line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
              )}
              {/* dot */}
              <div className="relative z-10 mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full bg-primary ring-2 ring-background" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{step.label}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {connectorLabels[step.connector]}
                  </Badge>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">
                    {step.durationMs}ms
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
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
