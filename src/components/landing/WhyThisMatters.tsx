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
    <section className="px-6 py-20 bg-zinc-50/80">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium font-mono uppercase tracking-widest text-zinc-400">
          Why This Matters
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
          Built for AI WorkOS teams
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200">
                <r.icon className="h-4 w-4 text-zinc-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-md">
            <Link href="/app">Open demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
