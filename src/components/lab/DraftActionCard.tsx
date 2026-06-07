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
  email_draft: "Email Draft",
  crm_update_draft: "CRM Update",
  slack_update_draft: "Slack Update",
  calendar_event_draft: "Calendar Draft",
  email: "Email Draft",
  crm: "CRM Update",
  slack: "Slack Update",
  calendar: "Calendar Draft",
};

const toolIcons: Record<string, string> = {
  gmail: "✉",
  slack: "#",
  crm: "◎",
  docs: "▤",
  calendar: "◷",
};

interface DraftActionCardProps {
  actions: DraftAction[];
}

export function DraftActionCard({ actions }: DraftActionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Draft Actions</CardTitle>
        <Badge
          variant="secondary"
          className="text-[10px] border-0 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium uppercase tracking-wide"
        >
          Approval required
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2">
          <span className="text-amber-600 dark:text-amber-400 text-sm">⚠</span>
          <p className="text-xs text-muted-foreground">
            All actions are <span className="font-medium text-foreground/80">drafts only</span> — nothing is sent, posted, or created. Each action needs explicit approval before execution.
          </p>
        </div>
        <Accordion type="multiple" className="space-y-2">
          {actions.map((action) => (
            <AccordionItem
              key={action.id}
              value={action.id}
              className="rounded-lg border border-border/60 px-4"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left w-full">
                  <span className="text-base shrink-0">{toolIcons[action.targetTool] || "·"}</span>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] px-1.5 py-0"
                  >
                    {typeLabels[action.type]}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{action.title}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {action.summary}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-700 dark:text-red-400 font-medium"
                    >
                      Needs approval
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 text-muted-foreground"
                    >
                      Draft only
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2 space-y-3">
                  {action.approvalReason && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/5 rounded px-2.5 py-1.5 border border-amber-500/20">
                      <span className="font-medium">Approval reason:</span> {action.approvalReason}
                    </p>
                  )}
                  {action.recipient && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">To:</span>{" "}
                      {action.recipient}
                    </p>
                  )}
                  <pre className="whitespace-pre-wrap rounded-md bg-muted/60 p-3 text-xs leading-relaxed font-sans">
                    {action.body}
                  </pre>
                  {action.sourceIds.length > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      Based on {action.sourceIds.length} source{action.sourceIds.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
