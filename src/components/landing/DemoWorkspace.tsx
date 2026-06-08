import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const connectors = [
  {
    name: "Gmail",
    borderClass: "tool-border-gmail",
    badgeClass: "tool-bg-gmail",
    items: ["SOC2 compliance thread", "Pricing discussion", "Demo follow-up request"],
  },
  {
    name: "Calendar",
    borderClass: "tool-border-calendar",
    badgeClass: "tool-bg-calendar",
    items: ["Product demo (yesterday)", "Attendees & meeting notes"],
  },
  {
    name: "CRM",
    borderClass: "tool-border-crm",
    badgeClass: "tool-bg-crm",
    items: ["$48k ARR deal record", "Technical validation stage", "Risk & decision maker"],
  },
  {
    name: "Slack",
    borderClass: "tool-border-slack",
    badgeClass: "tool-bg-slack",
    items: ["Security objection thread", "Pricing strategy discussion", "Migration concerns"],
  },
  {
    name: "Docs",
    borderClass: "tool-border-docs",
    badgeClass: "tool-bg-docs",
    items: ["SOC2 security one-pager", "Migration playbook", "Pricing FAQ"],
  },
];

export function DemoWorkspace() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium font-mono uppercase tracking-widest text-[#71717A]">
          Demo Workspace
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5F5F5]">
          Realistic seeded workplace data
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A1A1AA]">
          The demo workspace includes seeded data across five connectors — emails, meetings, deals, messages, and documents that mirror a real enterprise sales workflow.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((c) => (
            <Card key={c.name} className={`border-l-2 ${c.borderClass} border-white/[0.08] bg-[#0D0D0F]`}>
              <CardContent className="pt-5">
                <Badge variant="secondary" className={`mb-3 text-[10px] font-medium ${c.badgeClass}`}>
                  {c.name}
                </Badge>
                <ul className="space-y-1.5">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-[#A1A1AA] leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
