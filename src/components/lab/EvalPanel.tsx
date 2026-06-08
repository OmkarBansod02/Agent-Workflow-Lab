import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EvalReport, EvalCheck } from "@/lib/types";

const statusIcon: Record<EvalCheck["status"], string> = {
  pass: "✓",
  warn: "⚠",
  fail: "✗",
};

const statusColor: Record<EvalCheck["status"], string> = {
  pass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  warn: "text-amber-400 bg-amber-500/15 border-amber-500/25",
  fail: "text-rose-400 bg-rose-500/15 border-rose-500/25",
};

const readinessConfig: Record<EvalReport["readiness"], { bg: string; ring: string; label: string; scoreBg: string; scoreText: string }> = {
  ready: {
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
    label: "Ready for review",
    scoreBg: "bg-emerald-500",
    scoreText: "text-emerald-400",
  },
  "needs-review": {
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    label: "Needs review",
    scoreBg: "bg-amber-500",
    scoreText: "text-amber-400",
  },
  blocked: {
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/20",
    label: "Blocked — unsafe to proceed",
    scoreBg: "bg-rose-500",
    scoreText: "text-rose-400",
  },
};

interface EvalPanelProps {
  report: EvalReport;
}

export function EvalPanel({ report }: EvalPanelProps) {
  const readiness = readinessConfig[report.readiness];

  const scoreBreakdown = [
    { label: "Retrieval", value: report.retrievalScore },
    { label: "Grounding", value: report.groundingScore },
    { label: "Approval", value: report.approvalScore },
    { label: "Missing info", value: report.missingInfoScore },
    { label: "Actions", value: report.actionCompletenessScore },
    { label: "Readiness", value: report.readinessScore },
  ];

  return (
    <Card className="border-white/[0.08] bg-[#1B1A18]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-sm font-semibold text-stone-100">Eval / Safety Report</CardTitle>
        <Badge className={`text-xs font-semibold border ${readiness.bg} ${readiness.scoreText} ${readiness.ring.replace("ring-", "border-")}`}>
          {readiness.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Readiness score hero */}
        <div className={`rounded-xl ${readiness.bg} ring-1 ${readiness.ring} px-6 py-5`}>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-white/[0.06]"
                  />
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(report.overallScore / 100) * 213.6} 213.6`}
                    className={readiness.scoreText}
                  />
                </svg>
                <span className="absolute text-xl font-bold tracking-tight text-[#F5F2ED]">
                  {report.overallScore}
                </span>
              </div>
              <p className="text-[10px] text-[#78716C] mt-1 font-mono">/ 100</p>
            </div>
            <div className="flex-1">
              <Progress value={report.overallScore} className="h-2.5" />
              <p className="mt-2.5 text-xs text-[#A8A29E] leading-relaxed">
                {report.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Score breakdown grid */}
        <div>
          <p className="mb-3 text-[10px] font-medium font-mono text-[#78716C] uppercase tracking-wider">
            Score Breakdown
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {scoreBreakdown.map((score) => (
              <div
                key={score.label}
                className="rounded-lg border border-white/[0.06] px-3 py-2.5 bg-[#201F1D]"
              >
                <p className="text-[10px] uppercase text-[#78716C] tracking-wide font-mono">
                  {score.label}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <p className="text-sm font-bold tabular-nums text-[#F5F2ED]">{score.value}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreColor(score.value)}`}
                      style={{ width: `${score.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checks */}
        <div>
          <p className="mb-3 text-[10px] font-medium font-mono text-[#78716C] uppercase tracking-wider">
            Safety Checks
          </p>
          <div className="space-y-2">
            {report.checks.map((check) => (
              <div
                key={check.id}
                className="flex items-start gap-3 rounded-lg border border-white/[0.06] px-3.5 py-2.5"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold border ${statusColor[check.status]}`}
                >
                  {statusIcon[check.status]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-200">{check.label}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-white/[0.08] text-[#78716C]"
                    >
                      {check.category}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-[#A8A29E] leading-relaxed">
                    {check.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {report.warnings.length > 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3.5">
            <p className="mb-2 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <span>⚠</span> Warnings
            </p>
            <ul className="space-y-1.5">
              {report.warnings.map((warning) => (
                <li
                  key={warning}
                  className="text-xs leading-relaxed text-amber-300 pl-4 relative before:absolute before:left-1.5 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-amber-400"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="rounded-lg border border-white/[0.06] bg-[#201F1D] px-4 py-3.5">
            <p className="mb-2 text-xs font-semibold text-stone-300">
              Recommendations
            </p>
            <ul className="space-y-1.5">
              {report.recommendations.map((rec) => (
                <li
                  key={rec}
                  className="text-xs leading-relaxed text-[#A8A29E] pl-4 relative before:absolute before:left-1.5 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-stone-600"
                >
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getScoreColor(value: number): string {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 60) return "bg-blue-500";
  if (value >= 40) return "bg-amber-500";
  return "bg-rose-500";
}
