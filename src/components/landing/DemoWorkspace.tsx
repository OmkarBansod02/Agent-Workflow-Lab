import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const connectors = [
  {
    name: "Gmail",
    items: ["SOC2 compliance thread", "Pricing discussion", "Demo follow-up request"],
  },
  {
    name: "Calendar",
    items: ["Product demo (yesterday)", "Attendees & meeting notes"],
  },
  {
    name: "CRM",
    items: ["$185K deal record", "Technical Evaluation stage", "Risk & decision maker"],
  },
  {
    name: "Slack",
    items: ["Security objection thread", "Pricing strategy discussion", "Migration concerns"],
  },
  {
    name: "Docs",
    items: ["SOC2 security one-pager", "Migration playbook", "Pricing FAQ"],
  },
];

export function DemoWorkspace() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Demo Workspace
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Realistic seeded workplace data
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The demo workspace includes seeded data across five connectors — emails, meetings, deals, messages, and documents that mirror a real enterprise sales workflow.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((c) => (
            <Card key={c.name} className="border-border/60">
              <CardContent className="pt-5">
                <Badge variant="outline" className="mb-3 text-xs">
                  {c.name}
                </Badge>
                <ul className="space-y-1.5">
                  {c.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground leading-relaxed"
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
