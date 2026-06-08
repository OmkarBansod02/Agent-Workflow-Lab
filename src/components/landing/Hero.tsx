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
  { label: "Sources retrieved", icon: FileText, color: "text-[#FF6A3D]" },
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
    <section className="warm-hero-bg flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#201F1D] px-3.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium font-mono tracking-wide text-stone-400 uppercase">
          Workflow Testing Lab
        </span>
      </div>

      <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-[#F5F2ED]">
        Test agent workflows before they touch real work
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#A8A29E]">
        Agent Workflow Lab runs AI workflows against a realistic seeded
        workplace, creates draft actions, and evaluates readiness before
        execution.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button asChild size="lg" className="bg-[#FF5A2A] hover:bg-[#FF7048] text-white accent-glow">
          <Link href="/app">Open demo</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-white/[0.08] text-stone-300 hover:bg-white/[0.04] hover:text-stone-100">
          <Link href="#how-it-works">How it works</Link>
        </Button>
      </div>

      {/* Pipeline label */}
      <div className="mt-10 flex items-center gap-1.5 text-[11px] font-mono text-[#78716C]">
        {pipelineLabels.map((label, i) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="text-[#A8A29E]">{label}</span>
            {i < pipelineLabels.length - 1 && (
              <span className="text-[#78716C]">→</span>
            )}
          </span>
        ))}
      </div>

      {/* Dark product preview card */}
      <div className="mt-5 w-full max-w-xl rounded-xl border border-[#FF5A2A]/15 bg-[#131210] accent-card-glow p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-mono font-medium text-[#78716C] uppercase tracking-wider">
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
              className="flex items-center gap-3 rounded-lg bg-[#201F1D] border border-white/[0.04] px-3.5 py-2.5"
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
              <span className="text-sm text-stone-300">{label}</span>
              <span className="ml-auto text-[10px] font-mono text-[#78716C]">
                ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
