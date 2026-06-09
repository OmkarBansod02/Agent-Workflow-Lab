"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_REQUEST } from "@/lib/demo-data";

type RunMode = "compiled-workflow" | "request-only" | string;

interface WorkflowInputProps {
  request?: string;
  isLoading?: boolean;
  isCompiling?: boolean;
  error?: string | null;
  compileError?: string | null;
  runMode?: RunMode;
  onRequestChange?: (request: string) => void;
  onCompile?: () => void;
  onRun?: () => void;
}

export function WorkflowInput({
  request = DEMO_REQUEST,
  isLoading = false,
  isCompiling = false,
  error,
  compileError,
  runMode,
  onRequestChange,
  onCompile,
  onRun,
}: WorkflowInputProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#1B1A18] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-[#78716C]">&gt;</span>
          <label className="text-sm font-semibold text-stone-100">Workflow Request</label>
        </div>
        <Badge className="text-[10px] font-mono bg-[#262320] text-[#78716C] border border-white/[0.08] hover:bg-[#262320]">
          Seeded runner
        </Badge>
      </div>
      <Textarea
        className="min-h-[88px] resize-none text-sm leading-relaxed border-white/[0.06] bg-[#131210] text-stone-100 placeholder:text-[#78716C] focus-visible:ring-[#FF5A2A]/30 focus-visible:border-[#FF5A2A]/40"
        value={request}
        onChange={(event) => onRequestChange?.(event.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onCompile}
          disabled={isCompiling || isLoading}
          className="border-[#FF5A2A]/30 text-[#FF6A3D] hover:bg-[#FF5A2A]/12 hover:text-[#FF7048]"
        >
          {isCompiling ? "Compiling..." : "Compile workflow"}
        </Button>
        <Button
          onClick={onRun}
          disabled={isLoading || isCompiling}
          className="bg-[#FF5A2A] hover:bg-[#FF7048] text-white accent-glow"
        >
          {isLoading ? "Running..." : "Run workflow"}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#78716C]">
          Runs against seeded workplace data only
        </span>
        {runMode === "compiled-workflow" && (
          <Badge variant="outline" className="text-[10px] shrink-0 border-[#FF5A2A]/30 text-[#FF6A3D] bg-[#FF5A2A]/12">
            Compiled AI plan
          </Badge>
        )}
        {runMode === "request-only" && (
          <Badge variant="outline" className="text-[10px] shrink-0 border-white/[0.08] text-[#A8A29E]">
            Request-only
          </Badge>
        )}
      </div>

      <p className="rounded-lg border border-white/[0.06] bg-[#201F1D] px-3 py-2 text-[11px] leading-relaxed text-[#A8A29E]">
        <span className="font-medium text-stone-300">AI plans.</span> Deterministic runner executes.{" "}
        <span className="font-medium text-stone-300">Eval checks safety</span> before action.
      </p>

      {compileError ? (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-2">{compileError}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-2">{error}</p>
      ) : null}
    </div>
  );
}
