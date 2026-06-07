import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TraceEvent } from "@/lib/types";

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

interface TraceTimelineProps {
  events: TraceEvent[];
}

export function TraceTimeline({ events }: TraceTimelineProps) {
  const totalMs = events.reduce((sum, e) => sum + e.durationMs, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Agent Run Trace</CardTitle>
        <span className="text-xs text-muted-foreground font-mono">
          {(totalMs / 1000).toFixed(1)}s total
        </span>
      </CardHeader>
      <CardContent>
        {/* bar chart */}
        <div className="mb-6 flex h-3 w-full overflow-hidden rounded-full bg-muted">
          {events.map((e) => {
            const widthPct = (e.durationMs / totalMs) * 100;
            return (
              <div
                key={e.id}
                className={`h-full ${getBarColor(e.type)}`}
                style={{ width: `${widthPct}%` }}
                title={`${e.label}: ${e.durationMs}ms`}
              />
            );
          })}
        </div>

        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="flex items-start gap-3">
              <Badge
                variant="secondary"
                className={`shrink-0 text-[10px] px-1.5 py-0 border-0 ${typeColors[e.type]}`}
              >
                {e.type}
              </Badge>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{e.label}</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">
                    {e.durationMs}ms
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {e.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getBarColor(type: TraceEvent["type"]): string {
  const map: Record<TraceEvent["type"], string> = {
    request_parsed: "bg-cyan-500",
    connector_search: "bg-blue-500",
    source_retrieved: "bg-violet-500",
    context_merged: "bg-amber-500",
    draft_prepared: "bg-emerald-500",
    approval_gate: "bg-cyan-500",
    eval_completed: "bg-rose-500",
    search: "bg-blue-500",
    retrieve: "bg-violet-500",
    analyze: "bg-amber-500",
    draft: "bg-emerald-500",
    eval: "bg-rose-500",
    compile: "bg-cyan-500",
  };
  return map[type];
}
