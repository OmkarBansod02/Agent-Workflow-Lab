import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkspaceSource, ConnectorType } from "@/lib/types";

const connectorLabels: Record<ConnectorType, string> = {
  gmail: "Gmail",
  calendar: "Calendar",
  crm: "CRM",
  slack: "Slack",
  docs: "Docs",
};

interface WorkspaceSourceCardProps {
  sources: WorkspaceSource[];
}

export function WorkspaceSourceCard({ sources }: WorkspaceSourceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Retrieved Workplace Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((src) => (
            <div
              key={src.id}
              className="rounded-lg border border-border/60 p-3.5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-snug">
                  {src.title}
                </h4>
                <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] px-1.5 py-0"
                >
                  {connectorLabels[src.connector]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {src.summary}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                {Object.entries(src.metadata).map(([key, value]) => (
                  <span key={key}>
                    <span className="font-medium text-foreground/70">{key}:</span>{" "}
                    {value}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(src.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {Math.round(src.relevance * 100)}% match
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
