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

interface WorkflowSummaryProps {
  data: WorkflowSummaryData;
}

export function WorkflowSummary({ data }: WorkflowSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Workflow Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Steps" value={data.stepsCount} />
          <Stat label="Sources found" value={data.sourcesFound} />
          <Stat label="Actions" value={data.actionsGenerated} />
          <Stat label="Duration" value={`${(data.totalDurationMs / 1000).toFixed(1)}s`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.connectors.map((c) => (
            <Badge key={c} variant="secondary" className="text-xs">
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
    <div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
