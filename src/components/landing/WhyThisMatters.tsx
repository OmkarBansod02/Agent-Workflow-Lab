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
    <section className="px-6 py-20 bg-[#131210]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium font-mono uppercase tracking-widest text-[#78716C]">
          Why This Matters
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5F2ED]">
          Built for AI WorkOS teams
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#262320] border border-white/[0.08]">
                <r.icon className="h-4 w-4 text-stone-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-100">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#A8A29E]">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button asChild size="lg" className="bg-[#FF5A2A] hover:bg-[#FF7048] text-white accent-glow">
            <Link href="/app">Open demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
