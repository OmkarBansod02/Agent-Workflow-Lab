const steps = [
  {
    number: "01",
    title: "Enter a messy request",
    description:
      "Paste a real-world workplace request — multi-step, ambiguous, cross-tool. Exactly what your agent will handle in production.",
  },
  {
    number: "02",
    title: "Workflow compiles",
    description:
      "The request is broken into structured steps with connector assignments. You see exactly what the agent plans to do.",
  },
  {
    number: "03",
    title: "Seeded workspace searched",
    description:
      "The agent searches realistic workplace data — emails, calendar, CRM, Slack, docs — all seeded and deterministic.",
  },
  {
    number: "04",
    title: "Draft actions generated",
    description:
      "The agent produces draft emails, CRM updates, Slack messages, and calendar invites. Nothing is sent — everything requires approval.",
  },
  {
    number: "05",
    title: "Eval & trace reported",
    description:
      "A full trace timeline and safety evaluation are generated. You see accuracy, completeness, tone, and compliance checks.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 bg-muted/40">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          How It Works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          From messy request to evaluated output
        </h2>
        <div className="mt-10 space-y-8">
          {steps.map((s) => (
            <div key={s.number} className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-mono font-semibold">
                {s.number}
              </div>
              <div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground max-w-xl">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
