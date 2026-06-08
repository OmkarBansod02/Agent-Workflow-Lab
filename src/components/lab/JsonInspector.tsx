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
    <div className="rounded-xl console-panel border overflow-hidden">
      <div
        className="cursor-pointer select-none px-5 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-zinc-300">
              Run Debug JSON
            </h3>
            <Badge className="text-[10px] px-1.5 py-0 bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono hover:bg-zinc-800">
              Replay Payload
            </Badge>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {isOpen ? "▾ Collapse" : "▸ Expand"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          Every run emits a replayable trace for debugging agent behavior.
        </p>
      </div>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1 text-[10px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
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
              <pre className="p-4 text-[11px] leading-relaxed font-mono text-zinc-400">
                {jsonString}
              </pre>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
