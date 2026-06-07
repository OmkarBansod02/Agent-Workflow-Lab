import Link from "next/link";
import { Button } from "@/components/ui/button";

const reasons = [
  {
    title: "Ship agent features faster",
    description:
      "Test multi-step workflows in minutes instead of wiring up real integrations and hoping nothing breaks.",
  },
  {
    title: "Catch failures before users do",
    description:
      "Eval reports surface accuracy, safety, and compliance issues before any action reaches production.",
  },
  {
    title: "Build trust with stakeholders",
    description:
      "Show exactly what the agent will do — trace timeline, draft actions, and safety checks — before connecting real tools.",
  },
  {
    title: "Deterministic testing",
    description:
      "Seeded workspace data means reproducible results. Every test run produces the same sources and the same eval.",
  },
];

export function WhyThisMatters() {
  return (
    <section className="px-6 py-20 bg-muted/40">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Why This Matters
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Built for AI WorkOS teams
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title}>
              <h3 className="text-base font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button asChild size="lg">
            <Link href="/app">Open demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
