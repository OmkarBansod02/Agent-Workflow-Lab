"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { DraftAction } from "@/lib/types";

const typeLabels: Record<DraftAction["type"], string> = {
  email: "Email Draft",
  crm: "CRM Update",
  slack: "Slack Update",
  calendar: "Calendar Draft",
};

interface DraftActionCardProps {
  actions: DraftAction[];
}

export function DraftActionCard({ actions }: DraftActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Draft Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-xs text-muted-foreground">
          All actions are drafts requiring approval. Nothing has been sent or
          executed.
        </p>
        <Accordion type="multiple" className="space-y-2">
          {actions.map((action) => (
            <AccordionItem
              key={action.id}
              value={action.id}
              className="rounded-lg border border-border/60 px-4"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] px-1.5 py-0"
                  >
                    {typeLabels[action.type]}
                  </Badge>
                  <div>
                    <span className="text-sm font-medium">{action.title}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {action.summary}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-auto shrink-0 text-[10px] px-1.5 py-0 uppercase"
                  >
                    {action.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2">
                  {action.recipient && (
                    <p className="mb-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">To:</span>{" "}
                      {action.recipient}
                    </p>
                  )}
                  <pre className="whitespace-pre-wrap rounded-md bg-muted/60 p-3 text-xs leading-relaxed font-sans">
                    {action.body}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
