import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Enter a messy request",
    description:
      "Paste a real-world workplace request — multi-step, ambiguous, cross-tool. Exactly what your agent will handle in production.",
    tools: [],
  },
  {
    number: "02",
    title: "Workflow compiles",
    description:
      "The request is broken into structured steps with connector assignments. You see exactly what the agent plans to do.",
    tools: [],
  },
  {
    number: "03",
    title: "Seeded workspace searched",
    description:
      "The agent searches realistic workplace data — emails, calendar, CRM, Slack, docs — all seeded and deterministic.",
    tools: ["Gmail", "Calendar", "CRM", "Slack", "Docs"],
  },
  {
    number: "04",
    title: "Draft actions generated",
    description:
      "The agent produces draft emails, CRM updates, Slack messages, and calendar invites. Nothing is sent — everything requires approval.",
    tools: [],
  },
  {
    number: "05",
    title: "Eval & trace reported",
    description:
      "A full trace timeline and safety evaluation are generated. You see accuracy, completeness, tone, and compliance checks.",
    tools: [],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 bg-[#131210]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium font-mono uppercase tracking-widest text-[#78716C]">
          How It Works
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5F2ED]">
          From messy request to evaluated output
        </h2>
        <div className="mt-10 relative">
          <div className="absolute left-[15px] top-[24px] bottom-[24px] w-px bg-white/[0.06]" />

          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.number} className="relative flex gap-5">
                <div className="relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#262320] text-xs font-mono font-semibold text-stone-300">
                  {s.number}
                </div>
                <div className="pb-1">
                  <h3 className="text-sm font-semibold text-stone-100">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#A8A29E] max-w-xl">
                    {s.description}
                  </p>
                  {s.tools.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.tools.map((tool) => (
                        <Badge
                          key={tool}
                          variant="secondary"
                          className={`text-[10px] ${getToolClass(tool)}`}
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getToolClass(tool: string): string {
  const map: Record<string, string> = {
    Gmail: "tool-bg-gmail",
    Calendar: "tool-bg-calendar",
    CRM: "tool-bg-crm",
    Slack: "tool-bg-slack",
    Docs: "tool-bg-docs",
  };
  return map[tool] ?? "";
}
