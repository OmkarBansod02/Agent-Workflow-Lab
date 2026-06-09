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

const connectorBorderClass: Record<ConnectorType, string> = {
  gmail: "tool-border-gmail",
  calendar: "tool-border-calendar",
  crm: "tool-border-crm",
  slack: "tool-border-slack",
  docs: "tool-border-docs",
};

const connectorBadgeClass: Record<ConnectorType, string> = {
  gmail: "tool-bg-gmail",
  calendar: "tool-bg-calendar",
  crm: "tool-bg-crm",
  slack: "tool-bg-slack",
  docs: "tool-bg-docs",
};

interface WorkspaceSourceCardProps {
  sources: WorkspaceSource[];
}

export function WorkspaceSourceCard({ sources }: WorkspaceSourceCardProps) {
  return (
    <Card className="border-white/[0.08] bg-[#1B1A18]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[15px] font-semibold text-stone-100">Retrieved Workplace Sources</CardTitle>
          <span className="text-[11px] font-mono text-[#78716C]">{sources.length} results</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((src) => (
            <div
              key={src.id}
              className={`rounded-lg border-l-2 ${connectorBorderClass[src.connector]} border border-white/[0.06] bg-[#201F1D] p-4 space-y-2.5`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-snug text-stone-200">
                  {src.title}
                </h4>
                <Badge
                  variant="secondary"
                  className={`shrink-0 text-[11px] px-1.5 py-0 ${connectorBadgeClass[src.connector]}`}
                >
                  {connectorLabels[src.connector]}
                </Badge>
              </div>
              <p className="text-[13px] text-[#A8A29E] leading-relaxed">
                {src.summary}
              </p>

              {src.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {src.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-[#2A2724] px-2 py-0.5 text-[11px] text-[#A8A29E] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 text-[11px] text-[#78716C]">
                {Object.entries(src.metadata).map(([key, value]) => (
                  <span key={key}>
                    <span className="font-medium text-[#A8A29E]">{key}:</span>{" "}
                    {value}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                <span className="text-[11px] text-[#78716C]">
                  {new Date(src.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <RelevanceIndicator score={src.relevance} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RelevanceIndicator({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 90
      ? "bg-emerald-500"
      : pct >= 70
        ? "bg-blue-500"
        : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-mono text-[#78716C] tabular-nums">{pct}%</span>
    </div>
  );
}
