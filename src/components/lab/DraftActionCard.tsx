"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldAlert } from "lucide-react";
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

const toolBadgeClass: Record<string, string> = {
  gmail: "tool-bg-gmail",
  calendar: "tool-bg-calendar",
  crm: "tool-bg-crm",
  slack: "tool-bg-slack",
  docs: "tool-bg-docs",
};

interface DraftActionCardProps {
  actions: DraftAction[];
}

export function DraftActionCard({ actions }: DraftActionCardProps) {
  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-zinc-900">Draft Actions</CardTitle>
        <Badge className="text-[10px] font-medium uppercase tracking-wide bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100">
          Approval required
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Approval warning banner */}
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800">
            All actions are <span className="font-semibold">drafts only</span> — nothing is sent, posted, or created. Each action needs explicit approval before execution.
          </p>
        </div>

        <Accordion type="multiple" className="space-y-2">
          {actions.map((action) => (
            <AccordionItem
              key={action.id}
              value={action.id}
              className="rounded-lg border border-zinc-200 px-4 shadow-sm"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left w-full">
                  <span className={`text-base shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md ${toolBadgeClass[action.targetTool] ?? "bg-zinc-100"}`}>
                    {toolIcons[action.targetTool] || "·"}
                  </span>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] px-1.5 py-0 border-zinc-200 text-zinc-500"
                  >
                    {typeLabels[action.type]}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-zinc-800">{action.title}</span>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      {action.summary}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <Badge className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100">
                      Needs approval
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-zinc-300 text-zinc-500"
                    >
                      Draft only
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2 space-y-3">
                  {action.approvalReason && (
                    <div className="text-xs text-amber-800 bg-amber-50 rounded-md px-3 py-2 border border-amber-200">
                      <span className="font-semibold">Approval reason:</span> {action.approvalReason}
                    </div>
                  )}
                  {action.recipient && (
                    <p className="text-xs text-zinc-500">
                      <span className="font-medium text-zinc-600">To:</span>{" "}
                      {action.recipient}
                    </p>
                  )}
                  <pre className="whitespace-pre-wrap rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-xs leading-relaxed font-sans text-zinc-700">
                    {action.body}
                  </pre>
                  {action.sourceIds.length > 0 && (
                    <p className="text-[10px] text-zinc-400 font-mono">
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
