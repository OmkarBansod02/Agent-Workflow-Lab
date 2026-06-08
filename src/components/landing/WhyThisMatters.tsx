import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Eye, Users, FlaskConical } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Ship agent features faster",
    description:
      "Test multi-step workflows in minutes instead of wiring up real integrations and hoping nothing breaks.",
  },
  {
    icon: Eye,
    title: "Catch failures before users do",
    description:
      "Eval reports surface accuracy, safety, and compliance issues before any action reaches production.",
  },
  {
    icon: Users,
    title: "Build trust with stakeholders",
    description:
      "Show exactly what the agent will do — trace timeline, draft actions, and safety checks — before connecting real tools.",
  },
  {
    icon: FlaskConical,
    title: "Deterministic testing",
    description:
      "Seeded workspace data means reproducible results. Every test run produces the same sources and the same eval.",
  },
];

export function WhyThisMatters() {
  return (
    <section className="px-6 py-20 bg-[#0A0A0C]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium font-mono uppercase tracking-widest text-[#71717A]">
          Why This Matters
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5F5F5]">
          Built for AI WorkOS teams
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#17171A] border border-white/[0.08]">
                <r.icon className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#A1A1AA]">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20">
            <Link href="/app">Open demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
