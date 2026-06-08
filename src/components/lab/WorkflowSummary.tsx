import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkflowSummaryData, ConnectorType } from "@/lib/types";

const connectorLabels: Record<ConnectorType, string> = {
  gmail: "Gmail",
  calendar: "Calendar",
  crm: "CRM",
  slack: "Slack",
  docs: "Docs",
};

const connectorBadgeClass: Record<ConnectorType, string> = {
  gmail: "tool-bg-gmail",
  calendar: "tool-bg-calendar",
  crm: "tool-bg-crm",
  slack: "tool-bg-slack",
  docs: "tool-bg-docs",
};

interface WorkflowSummaryProps {
  data: WorkflowSummaryData;
}

export function WorkflowSummary({ data }: WorkflowSummaryProps) {
  return (
    <Card className="border-white/[0.08] bg-[#0D0D0F]">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-zinc-100">Workflow Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Steps" value={data.stepsCount} />
          <Stat label="Sources found" value={data.sourcesFound} />
          <Stat label="Actions" value={data.actionsGenerated} />
          <Stat label="Duration" value={`${(data.totalDurationMs / 1000).toFixed(1)}s`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {data.connectors.map((c) => (
            <Badge key={c} variant="secondary" className={`text-[10px] font-medium ${connectorBadgeClass[c]}`}>
              {connectorLabels[c]}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-[#111113] border border-white/[0.06] px-3.5 py-3">
      <p className="text-2xl font-bold tracking-tight text-[#F5F5F5]">{value}</p>
      <p className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}
