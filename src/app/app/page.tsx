import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WorkflowInput } from "@/components/lab/WorkflowInput";
import { WorkflowSummary } from "@/components/lab/WorkflowSummary";
import { ToolStepTimeline } from "@/components/lab/ToolStepTimeline";
import { WorkspaceSourceCard } from "@/components/lab/WorkspaceSourceCard";
import { TraceTimeline } from "@/components/lab/TraceTimeline";
import { DraftActionCard } from "@/components/lab/DraftActionCard";
import { EvalPanel } from "@/components/lab/EvalPanel";
import { JsonInspector } from "@/components/lab/JsonInspector";
import { demoData } from "@/lib/demo-data";

export default function AppPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/60">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight hover:text-muted-foreground transition-colors"
          >
            Agent Workflow Lab
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">Demo Workspace</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          Demo workspace: seeded workplace data
        </Badge>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8 space-y-8">
        {/* Input */}
        <WorkflowInput />

        <Separator />

        {/* Workflow Summary */}
        <WorkflowSummary data={demoData.workflowSummary} />

        {/* Two-column layout for timeline + sources */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolStepTimeline steps={demoData.steps} />
          <TraceTimeline events={demoData.trace} />
        </div>

        {/* Sources */}
        <WorkspaceSourceCard sources={demoData.sources} />

        {/* Draft Actions */}
        <DraftActionCard actions={demoData.actions} />

        {/* Eval */}
        <EvalPanel report={demoData.eval} />

        {/* JSON Inspector */}
        <JsonInspector data={demoData} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Agent Workflow Lab — Phase 0 static UI demo. All data is seeded. No
          real actions are taken.
        </p>
      </footer>
    </div>
  );
}
