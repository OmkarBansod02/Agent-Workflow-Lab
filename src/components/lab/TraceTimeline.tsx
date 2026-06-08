import { Badge } from "@/components/ui/badge";
import type { TraceEvent } from "@/lib/types";

const statusStyles: Record<TraceEvent["status"], { dot: string; border: string }> = {
  success: { dot: "bg-emerald-400", border: "border-l-emerald-400/60" },
  warning: { dot: "bg-amber-400", border: "border-l-amber-400/60" },
  blocked: { dot: "bg-rose-400", border: "border-l-rose-400/60" },
};

const typeColors: Record<TraceEvent["type"], string> = {
  request_parsed: "bg-cyan-500/15 text-cyan-300",
  connector_search: "bg-blue-500/15 text-blue-300",
  source_retrieved: "bg-violet-500/15 text-violet-300",
  context_merged: "bg-amber-500/15 text-amber-300",
  draft_prepared: "bg-emerald-500/15 text-emerald-300",
  approval_gate: "bg-cyan-500/15 text-cyan-300",
  eval_completed: "bg-rose-500/15 text-rose-300",
  search: "bg-blue-500/15 text-blue-300",
  retrieve: "bg-violet-500/15 text-violet-300",
  analyze: "bg-amber-500/15 text-amber-300",
  draft: "bg-emerald-500/15 text-emerald-300",
  eval: "bg-rose-500/15 text-rose-300",
  compile: "bg-cyan-500/15 text-cyan-300",
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
    <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0C] overflow-hidden shadow-lg shadow-violet-500/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">trace</span>
            <h3 className="text-sm font-semibold text-zinc-100">Agent Trace</h3>
          </div>
          <p className="mt-0.5 text-[11px] text-[#71717A] font-mono">
            {events.length} spans · {(totalMs / 1000).toFixed(1)}s total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {successCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {successCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {warningCount}
            </span>
          )}
          {blockedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              {blockedCount}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Waterfall bar */}
        <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full bg-white/[0.04]">
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
                className={`flex items-start gap-3 rounded-md border-l-2 ${style.border} bg-[#111113] border border-white/[0.04] px-3 py-2.5 transition-colors hover:bg-[#17171A]`}
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium leading-tight text-zinc-200">{e.label}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 border-0 ${typeColors[e.type]}`}
                    >
                      {e.type}
                    </Badge>
                    {e.tool && (
                      <span className="inline-flex items-center gap-0.5 rounded border border-white/[0.08] bg-[#17171A] px-1.5 py-0 text-[10px] font-mono text-[#A1A1AA]">
                        {toolIcons[e.tool] || "·"} {e.tool}
                      </span>
                    )}
                    {e.sources && e.sources.length > 0 && (
                      <span className="text-[10px] text-[#71717A] font-mono">
                        {e.sources.length} source{e.sources.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] font-mono text-[#71717A] tabular-nums">
                      {e.durationMs}ms
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#71717A] leading-relaxed">
                    {e.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getBarColor(status: TraceEvent["status"]): string {
  const map: Record<TraceEvent["status"], string> = {
    success: "bg-emerald-500/80",
    warning: "bg-amber-500/80",
    blocked: "bg-rose-500/80",
  };
  return map[status];
}
