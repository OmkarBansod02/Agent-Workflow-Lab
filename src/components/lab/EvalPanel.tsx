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
  pass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  warn: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  fail: "text-red-600 dark:text-red-400 bg-red-500/10",
};

const readinessConfig: Record<EvalReport["readiness"], { bg: string; ring: string; label: string }> = {
  ready: {
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
    label: "Ready for review",
  },
  "needs-review": {
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
    label: "Needs review",
  },
  blocked: {
    bg: "bg-red-500/10",
    ring: "ring-red-500/30",
    label: "Blocked — unsafe to proceed",
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base">Eval / Safety Report</CardTitle>
        <Badge
          variant="secondary"
          className={`text-xs border-0 font-medium ${readiness.bg}`}
        >
          {readiness.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Readiness score hero */}
        <div className={`rounded-lg ${readiness.bg} ring-1 ${readiness.ring} px-5 py-4`}>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-4xl font-bold tracking-tight">{report.overallScore}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">/ 100</p>
            </div>
            <div className="flex-1">
              <Progress value={report.overallScore} className="h-2.5" />
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {report.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Score breakdown grid */}
        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Score Breakdown
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {scoreBreakdown.map((score) => (
              <div
                key={score.label}
                className="rounded-md border border-border/60 px-3 py-2.5 bg-muted/20"
              >
                <p className="text-[10px] uppercase text-muted-foreground tracking-wide">
                  {score.label}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <p className="text-sm font-semibold tabular-nums">{score.value}</p>
                  <Progress value={score.value} className="flex-1 h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checks */}
        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Safety Checks
          </p>
          <div className="space-y-2">
            {report.checks.map((check) => (
              <div
                key={check.id}
                className="flex items-start gap-3 rounded-md border border-border/40 px-3 py-2.5"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${statusColor[check.status]}`}
                >
                  {statusIcon[check.status]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{check.label}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {check.category}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {check.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {report.warnings.length > 0 && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span>⚠</span> Warnings
            </p>
            <ul className="space-y-1.5">
              {report.warnings.map((warning) => (
                <li
                  key={warning}
                  className="text-xs leading-relaxed text-muted-foreground pl-4 relative before:absolute before:left-1.5 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-amber-500/50"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div className="rounded-md border border-border/60 bg-muted/20 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Recommendations
            </p>
            <ul className="space-y-1.5">
              {report.recommendations.map((rec) => (
                <li
                  key={rec}
                  className="text-xs leading-relaxed text-muted-foreground pl-4 relative before:absolute before:left-1.5 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/40"
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
