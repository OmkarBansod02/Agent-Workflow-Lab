import { Card, CardContent } from "@/components/ui/card";

const problems = [
  {
    title: "Agents fail silently",
    description:
      "You wire up an agent to real Gmail, Slack, and CRM — then it sends the wrong email to the wrong person. No undo.",
  },
  {
    title: "No safe testing ground",
    description:
      "There's no staging environment for agent workflows. You either test against production data or don't test at all.",
  },
  {
    title: "Eval happens too late",
    description:
      "By the time you catch a bad output, the damage is done. Safety checks should happen before execution, not after.",
  },
];

export function Problem() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          The Problem
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Agent workflows are dangerous without a sandbox
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {problems.map((p) => (
            <Card key={p.title} className="border-border/60">
              <CardContent className="pt-6">
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
