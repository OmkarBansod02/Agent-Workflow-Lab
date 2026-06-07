import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EvalReport, EvalCheck } from "@/lib/types";

const statusIcon: Record<EvalCheck["status"], string> = {
  pass: "✓",
  warn: "!",
  fail: "✗",
};

const statusColor: Record<EvalCheck["status"], string> = {
  pass: "text-emerald-600 dark:text-emerald-400",
  warn: "text-amber-600 dark:text-amber-400",
  fail: "text-red-600 dark:text-red-400",
};

const readinessColor: Record<EvalReport["readiness"], string> = {
  ready: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "needs-review": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  blocked: "bg-red-500/10 text-red-700 dark:text-red-400",
};

interface EvalPanelProps {
  report: EvalReport;
}

export function EvalPanel({ report }: EvalPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Eval / Safety Report</CardTitle>
        <Badge
          variant="secondary"
          className={`text-xs border-0 ${readinessColor[report.readiness]}`}
        >
          {report.readiness === "ready"
            ? "Ready for review"
            : report.readiness === "needs-review"
              ? "Needs review"
              : "Blocked"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight">
              {report.overallScore}
            </p>
            <p className="text-xs text-muted-foreground">Overall score</p>
          </div>
          <Progress value={report.overallScore} className="flex-1 h-2" />
        </div>
        <p className="mb-5 text-xs text-muted-foreground leading-relaxed">
          {report.summary}
        </p>
        <div className="space-y-3">
          {report.checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3">
              <span
                className={`mt-0.5 text-sm font-semibold ${statusColor[check.status]}`}
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
      </CardContent>
    </Card>
  );
}
