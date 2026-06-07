"use client";

import Link from "next/link";
import { useState } from "react";
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
import type { DemoRun } from "@/lib/types";

export default function AppPage() {
  const [request, setRequest] = useState(demoData.request);
  const [run, setRun] = useState<DemoRun>(demoData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    const trimmedRequest = request.trim();

    if (!trimmedRequest) {
      setError("Enter a workflow request before running the seeded workflow.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request: trimmedRequest }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "Unable to run seeded workflow.",
        );
      }

      setRun(payload as DemoRun);
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Unable to run seeded workflow.",
      );
    } finally {
      setIsLoading(false);
    }
  }

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
        <WorkflowInput
          request={request}
          isLoading={isLoading}
          error={error}
          onRequestChange={setRequest}
          onRun={handleRun}
        />

        <Separator />

        {/* Workflow Summary */}
        <WorkflowSummary data={run.workflowSummary} />

        {/* Two-column layout for timeline + sources */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolStepTimeline steps={run.steps} />
          <TraceTimeline events={run.trace} />
        </div>

        {/* Sources */}
        <WorkspaceSourceCard sources={run.sources} />

        {/* Draft Actions */}
        <DraftActionCard actions={run.actions} />

        {/* Eval */}
        <EvalPanel report={run.eval} />

        {/* JSON Inspector */}
        <JsonInspector data={run} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Agent Workflow Lab - Phase 1 seeded workspace runner. All data is
          seeded. No real tools are touched.
        </p>
      </footer>
    </div>
  );
}
