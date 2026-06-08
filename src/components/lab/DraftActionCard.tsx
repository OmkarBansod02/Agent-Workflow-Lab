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
    <Card className="border-white/[0.08] bg-[#1B1A18]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-stone-100">Draft Actions</CardTitle>
        <Badge className="text-[10px] font-medium uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/15">
          Approval required
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Approval warning banner */}
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            All actions are <span className="font-semibold text-amber-200">drafts only</span> — nothing is sent, posted, or created. Each action needs explicit approval before execution.
          </p>
        </div>

        <Accordion type="multiple" className="space-y-2">
          {actions.map((action) => (
            <AccordionItem
              key={action.id}
              value={action.id}
              className="rounded-lg border border-white/[0.08] px-4"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left w-full">
                  <span className={`text-base shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md ${toolBadgeClass[action.targetTool] ?? "bg-[#262320]"}`}>
                    {toolIcons[action.targetTool] || "·"}
                  </span>
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] px-1.5 py-0 border-white/[0.08] text-[#A8A29E]"
                  >
                    {typeLabels[action.type]}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-stone-200">{action.title}</span>
                    <p className="text-xs text-[#78716C] mt-0.5 truncate">
                      {action.summary}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 shrink-0">
                    <Badge className="text-[10px] px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 font-semibold hover:bg-amber-500/15">
                      Needs approval
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-white/[0.08] text-[#A8A29E]"
                    >
                      Draft only
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2 space-y-3">
                  {action.approvalReason && (
                    <div className="text-xs text-amber-300 bg-amber-500/10 rounded-md px-3 py-2 border border-amber-500/20">
                      <span className="font-semibold text-amber-200">Approval reason:</span> {action.approvalReason}
                    </div>
                  )}
                  {action.recipient && (
                    <p className="text-xs text-[#A8A29E]">
                      <span className="font-medium text-stone-300">To:</span>{" "}
                      {action.recipient}
                    </p>
                  )}
                  <pre className="whitespace-pre-wrap rounded-lg bg-[#131210] border border-white/[0.06] p-4 text-xs leading-relaxed font-sans text-stone-300">
                    {action.body}
                  </pre>
                  {action.sourceIds.length > 0 && (
                    <p className="text-[10px] text-[#78716C] font-mono">
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
