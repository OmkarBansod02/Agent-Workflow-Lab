import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Search,
  FileText,
  PenLine,
  ShieldCheck,
} from "lucide-react";

const pipelineSteps = [
  { label: "AI plan received", icon: CheckCircle2, color: "text-emerald-400" },
  { label: "Seeded workspace searched", icon: Search, color: "text-blue-400" },
  { label: "Sources retrieved", icon: FileText, color: "text-violet-400" },
  { label: "Draft actions prepared", icon: PenLine, color: "text-amber-400" },
  { label: "Approval required", icon: ShieldCheck, color: "text-rose-400" },
];

const pipelineLabels = [
  "Request",
  "AI plan",
  "Seeded runner",
  "Eval",
  "Approval-gated drafts",
];

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium font-mono tracking-wide text-zinc-600 uppercase">
          Workflow Testing Lab
        </span>
      </div>

      <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-zinc-950">
        Test agent workflows before they touch real work
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500">
        Agent Workflow Lab runs AI workflows against a realistic seeded
        workplace, creates draft actions, and evaluates readiness before
        execution.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-md">
          <Link href="/app">Open demo</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-zinc-300 text-zinc-700 hover:bg-zinc-50">
          <Link href="#how-it-works">How it works</Link>
        </Button>
      </div>

      {/* Pipeline label */}
      <div className="mt-10 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
        {pipelineLabels.map((label, i) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="text-zinc-500">{label}</span>
            {i < pipelineLabels.length - 1 && (
              <span className="text-zinc-300">→</span>
            )}
          </span>
        ))}
      </div>

      {/* Dark product preview card */}
      <div className="mt-5 w-full max-w-xl rounded-xl console-panel border shadow-2xl shadow-zinc-950/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
            Run preview
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            Complete
          </span>
        </div>
        <div className="space-y-2.5">
          {pipelineSteps.map(({ label, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg console-panel-subtle px-3.5 py-2.5"
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
              <span className="text-sm text-zinc-300">{label}</span>
              <span className="ml-auto text-[10px] font-mono text-zinc-500">
                ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
