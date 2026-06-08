import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, Clock } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Agents fail silently",
    description:
      "You wire up an agent to real Gmail, Slack, and CRM — then it sends the wrong email to the wrong person. No undo.",
  },
  {
    icon: Shield,
    title: "No safe testing ground",
    description:
      "There's no staging environment for agent workflows. You either test against production data or don't test at all.",
  },
  {
    icon: Clock,
    title: "Eval happens too late",
    description:
      "By the time you catch a bad output, the damage is done. Safety checks should happen before execution, not after.",
  },
];

export function Problem() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium font-mono uppercase tracking-widest text-[#78716C]">
          The Problem
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5F2ED]">
          Agent workflows are dangerous without a sandbox
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {problems.map((p) => (
            <Card key={p.title} className="border-l-2 border-l-rose-400/60 border-white/[0.08] bg-[#1B1A18]">
              <CardContent className="pt-5">
                <p.icon className="h-4 w-4 text-rose-400/70 mb-3" />
                <h3 className="text-sm font-semibold text-stone-100">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A8A29E]">
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
