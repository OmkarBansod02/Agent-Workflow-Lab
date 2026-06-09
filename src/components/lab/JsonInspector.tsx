"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";
import type { DemoWorkspaceData } from "@/lib/types";

interface JsonInspectorProps {
  data: DemoWorkspaceData;
}

export function JsonInspector({ data }: JsonInspectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  function handleCopy() {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#131210] overflow-hidden">
      <div
        className="cursor-pointer select-none px-5 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-[15px] font-semibold text-stone-300">
              Run Debug JSON
            </h3>
            <Badge className="text-[11px] px-1.5 py-0 bg-[#262320] text-[#78716C] border border-white/[0.08] font-mono hover:bg-[#262320]">
              Replay Payload
            </Badge>
          </div>
          <span className="text-xs text-[#78716C] font-mono">
            {isOpen ? "▾ Collapse" : "▸ Expand"}
          </span>
        </div>
        <p className="mt-1 text-xs text-[#78716C]">
          Every run emits a replayable trace for debugging agent behavior.
        </p>
      </div>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="relative rounded-lg border border-white/[0.06] bg-[#0E0D0C] overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-md bg-[#262320] border border-white/[0.08] px-2 py-1 text-[11px] text-[#A8A29E] hover:text-stone-200 hover:bg-[#2A2724] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
            <ScrollArea className="h-[400px] w-full">
              <pre className="p-4 text-xs leading-relaxed font-mono text-[#A8A29E]">
                {jsonString}
              </pre>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
