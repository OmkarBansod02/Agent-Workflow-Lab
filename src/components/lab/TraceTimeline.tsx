import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TraceEvent } from "@/lib/types";

const statusStyles: Record<TraceEvent["status"], { dot: string; border: string; label: string }> = {
  success: {
    dot: "bg-emerald-500",
    border: "border-l-emerald-500/60",
    label: "Success",
  },
  warning: {
    dot: "bg-amber-500",
    border: "border-l-amber-500/60",
    label: "Warning",
  },
  blocked: {
    dot: "bg-red-500",
    border: "border-l-red-500/60",
    label: "Blocked",
  },
};

const typeColors: Record<TraceEvent["type"], string> = {
  request_parsed: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  connector_search: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  source_retrieved: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  context_merged: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  draft_prepared: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  approval_gate: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  eval_completed: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  search: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  retrieve: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  analyze: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  draft: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  eval: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  compile: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
};

const toolIcons: Record<string, string> = {
  gmail: "✉",
  slack: "#",
  crm: "◎",
  docs: "▤",
  calendar: "◷",
};

interface TraceTimelineProps {
  events: TraceEvent[];
}

export function TraceTimeline({ events }: TraceTimelineProps) {
  const totalMs = events.reduce((sum, e) => sum + e.durationMs, 0);
  const successCount = events.filter((e) => e.status === "success").length;
  const warningCount = events.filter((e) => e.status === "warning").length;
  const blockedCount = events.filter((e) => e.status === "blocked").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Agent Trace</CardTitle>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {events.length} spans · {(totalMs / 1000).toFixed(1)}s
          </p>
        </div>
        <div className="flex items-center gap-2">
          {successCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {successCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {warningCount}
            </span>
          )}
          {blockedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-red-600 dark:text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {blockedCount}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Waterfall bar */}
        <div className="mb-5 flex h-2.5 w-full overflow-hidden rounded-full bg-muted/80">
          {events.map((e) => {
            const widthPct = (e.durationMs / totalMs) * 100;
            return (
              <div
                key={e.id}
                className={`h-full ${getBarColor(e.status)}`}
                style={{ width: `${widthPct}%` }}
                title={`${e.label}: ${e.durationMs}ms (${e.status})`}
              />
            );
          })}
        </div>

        {/* Trace spans */}
        <div className="space-y-1">
          {events.map((e) => {
            const style = statusStyles[e.status];
            return (
              <div
                key={e.id}
                className={`flex items-start gap-3 rounded-md border-l-2 ${style.border} bg-muted/20 px-3 py-2.5 transition-colors hover:bg-muted/40`}
              >
                {/* Status dot */}
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium leading-tight">{e.label}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 border-0 ${typeColors[e.type]}`}
                    >
                      {e.type}
                    </Badge>
                    {e.tool && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 font-mono">
                        {toolIcons[e.tool] || "·"} {e.tool}
                      </Badge>
                    )}
                    {e.sources && e.sources.length > 0 && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {e.sources.length} source{e.sources.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] font-mono text-muted-foreground tabular-nums">
                      {e.durationMs}ms
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {e.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function getBarColor(status: TraceEvent["status"]): string {
  const map: Record<TraceEvent["status"], string> = {
    success: "bg-emerald-500/80",
    warning: "bg-amber-500/80",
    blocked: "bg-red-500/80",
  };
  return map[status];
}
