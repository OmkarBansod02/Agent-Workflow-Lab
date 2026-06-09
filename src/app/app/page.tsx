"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowInput } from "@/components/lab/WorkflowInput";
import { CompiledWorkflowPanel } from "@/components/lab/CompiledWorkflowPanel";
import { WorkflowSummary } from "@/components/lab/WorkflowSummary";
import { ToolStepTimeline } from "@/components/lab/ToolStepTimeline";
import { WorkspaceSourceCard } from "@/components/lab/WorkspaceSourceCard";
import { TraceTimeline } from "@/components/lab/TraceTimeline";
import { DraftActionCard } from "@/components/lab/DraftActionCard";
import { EvalPanel } from "@/components/lab/EvalPanel";
import { JsonInspector } from "@/components/lab/JsonInspector";
import { DEMO_REQUEST } from "@/lib/demo-data";
import type { DemoRun } from "@/lib/types";
import type { CompiledWorkflow } from "@/lib/compiler-schema";

const SEQUENCE_STEPS = [
  { label: "AI compile", step: 1 },
  { label: "Seeded workspace search", step: 2 },
  { label: "Draft actions", step: 3 },
  { label: "Eval report", step: 4 },
] as const;

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#1B1A18]/60 px-6 py-12 text-center">
      <p className="text-sm text-[#78716C] leading-relaxed">{children}</p>
    </div>
  );
}

export default function AppPage() {
  const [request, setRequest] = useState(DEMO_REQUEST);
  const [run, setRun] = useState<DemoRun | null>(null);
  const [compiledWorkflow, setCompiledWorkflow] =
    useState<CompiledWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);

  async function handleCompile() {
    const trimmedRequest = request.trim();

    if (!trimmedRequest) {
      setCompileError("Enter a workflow request before compiling.");
      return;
    }

    setIsCompiling(true);
    setCompileError(null);

    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: trimmedRequest }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "Unable to compile workflow.",
        );
      }

      setCompiledWorkflow(payload.compiledWorkflow as CompiledWorkflow);
    } catch (compileErr) {
      setCompileError(
        compileErr instanceof Error
          ? compileErr.message
          : "Unable to compile workflow.",
      );
    } finally {
      setIsCompiling(false);
    }
  }

  async function handleRun() {
    const trimmedRequest = request.trim();

    if (!trimmedRequest) {
      setError("Enter a workflow request before running the seeded workflow.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload_body: { request: string; compiledWorkflow?: CompiledWorkflow } =
        { request: trimmedRequest };
      if (compiledWorkflow) {
        payload_body.compiledWorkflow = compiledWorkflow;
      }

      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload_body),
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

  const runMode = run
    ? (typeof run.rawJson.mode === "string" ? run.rawJson.mode : undefined)
    : undefined;

  const metrics = [
    { label: "Steps", value: run ? run.workflowSummary.stepsCount : "—" },
    { label: "Sources", value: run ? run.workflowSummary.sourcesFound : "—" },
    { label: "Actions", value: run ? run.workflowSummary.actionsGenerated : "—" },
    { label: "Readiness", value: run ? run.eval.readinessScore : "—" },
  ];

  const approvalGates = compiledWorkflow?.approvalGates ?? [];
  const missingInfo =
    compiledWorkflow?.missingInfo ?? run?.workflowSummary.missingInfo ?? [];

  return (
    <div className="app-shell-bg flex flex-col flex-1 min-h-screen">
      {/* Command-center header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#131210]/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-stone-100 hover:text-white transition-colors"
            >
              Agent Workflow Lab
            </Link>
            <Separator orientation="vertical" className="h-4 bg-white/[0.08]" />
            <span className="text-xs text-[#78716C] font-mono">Command Center</span>
          </div>
          <Badge className="text-[11px] font-mono bg-[#FF5A2A]/12 text-[#FF6A3D] border border-[#FF5A2A]/25 hover:bg-[#FF5A2A]/12">
            Demo workspace: seeded workplace data
          </Badge>
        </div>
      </header>

      {/* Two-column command center */}
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-5">
        <div className="grid items-start gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Left panel */}
          <aside className="space-y-4 lg:sticky lg:top-[68px]">
            <WorkflowInput
              request={request}
              isLoading={isLoading}
              isCompiling={isCompiling}
              error={error}
              compileError={compileError}
              runMode={runMode}
              onRequestChange={setRequest}
              onCompile={handleCompile}
              onRun={handleRun}
            />

            {/* Compact metrics */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1B1A18] p-4">
              <p className="mb-3 text-[11px] font-mono uppercase tracking-wider text-[#78716C]">
                Run metrics
              </p>
              <div className="grid grid-cols-2 gap-2">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-white/[0.06] bg-[#201F1D] px-3 py-2.5"
                  >
                    <p className="text-lg font-bold tracking-tight tabular-nums text-[#F5F2ED]">
                      {m.value}
                    </p>
                    <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-[#78716C]">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right workspace */}
          <Tabs defaultValue="overview" className="gap-4">
            <TabsList className="h-9 w-full justify-start overflow-x-auto border border-white/[0.08] bg-[#1B1A18] p-1">
              <TabsTrigger value="overview" className="text-[13px]">Overview</TabsTrigger>
              <TabsTrigger value="trace" className="text-[13px]">Trace</TabsTrigger>
              <TabsTrigger value="sources" className="text-[13px]">Sources</TabsTrigger>
              <TabsTrigger value="drafts" className="text-[13px]">Drafts</TabsTrigger>
              <TabsTrigger value="eval" className="text-[13px]">Eval</TabsTrigger>
              <TabsTrigger value="debug" className="text-[13px]">Debug</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-4">
              {/* Pipeline status */}
              <div className="rounded-xl border border-white/[0.08] bg-[#1B1A18] px-5 py-4">
                <p className="mb-3 text-[11px] font-mono uppercase tracking-wider text-[#78716C]">
                  Pipeline status
                </p>
                <div className="flex flex-wrap items-center gap-y-2">
                  {SEQUENCE_STEPS.map(({ label, step }, i) => (
                    <div key={step} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5A2A] text-[10px] font-semibold font-mono text-white shadow-[0_0_14px_-4px_rgba(255,90,42,0.6)]">
                          {step}
                        </span>
                        <span className="text-[13px] font-medium text-stone-300">{label}</span>
                      </div>
                      {i < SEQUENCE_STEPS.length - 1 && (
                        <span className="px-3 text-xs text-[#78716C]">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {!compiledWorkflow && !run && (
                <EmptyState>
                  Compile a workflow to see the agent plan, then run it against the seeded workspace.
                </EmptyState>
              )}

              {run && <WorkflowSummary data={run.workflowSummary} />}

              {compiledWorkflow && (
                <CompiledWorkflowPanel workflow={compiledWorkflow} />
              )}

              {/* Approval gates / missing info summary */}
              {(approvalGates.length > 0 || missingInfo.length > 0) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.08] bg-[#1B1A18] p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-stone-200">Approval gates</p>
                      <Badge className="text-[11px] font-medium uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/15">
                        {approvalGates.length} gate{approvalGates.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    {approvalGates.length > 0 ? (
                      <ul className="space-y-1.5">
                        {approvalGates.map((gate) => (
                          <li
                            key={gate.id}
                            className="rounded-md border-l-2 border-l-amber-400 border border-amber-500/20 bg-amber-500/10 px-3 py-2"
                          >
                            <span className="text-[13px] font-medium text-stone-200">{gate.title}</span>
                            <p className="mt-0.5 text-xs text-[#A8A29E]">{gate.reason}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#78716C]">
                        Compile a workflow to surface explicit approval gates. All actions remain
                        draft-only and require approval.
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-[#1B1A18] p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-stone-200">Missing info</p>
                      <Badge variant="outline" className="text-[11px] border-white/[0.08] text-[#A8A29E]">
                        {missingInfo.length} item{missingInfo.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    {missingInfo.length > 0 ? (
                      <ul className="space-y-1.5">
                        {missingInfo.map((info, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#A8A29E]">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                            {info}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#78716C]">No missing info flagged.</p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Trace */}
            <TabsContent value="trace" className="space-y-4">
              {run ? (
                <>
                  <TraceTimeline events={run.trace} />
                  <ToolStepTimeline steps={run.steps} />
                </>
              ) : (
                <EmptyState>Run the workflow to see trace events.</EmptyState>
              )}
            </TabsContent>

            {/* Sources */}
            <TabsContent value="sources">
              {run ? (
                <WorkspaceSourceCard sources={run.sources} />
              ) : (
                <EmptyState>Sources will appear after seeded workspace search.</EmptyState>
              )}
            </TabsContent>

            {/* Drafts */}
            <TabsContent value="drafts">
              {run ? (
                <DraftActionCard actions={run.actions} />
              ) : (
                <EmptyState>Draft actions will appear after the workflow run. Nothing is executed automatically.</EmptyState>
              )}
            </TabsContent>

            {/* Eval */}
            <TabsContent value="eval">
              {run ? (
                <EvalPanel report={run.eval} />
              ) : (
                <EmptyState>Eval report will appear after the run.</EmptyState>
              )}
            </TabsContent>

            {/* Debug */}
            <TabsContent value="debug">
              {run ? (
                <JsonInspector data={run} />
              ) : (
                <EmptyState>Debug payload will appear after a workflow run.</EmptyState>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#131210]/60 px-6 py-4">
        <p className="text-center text-xs text-[#78716C]">
          Agent Workflow Lab — compile + seeded workspace runner. All
          data is seeded. No real tools are touched.
        </p>
      </footer>
    </div>
  );
}
