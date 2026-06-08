"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_REQUEST } from "@/lib/demo-data";

interface WorkflowInputProps {
  request?: string;
  isLoading?: boolean;
  isCompiling?: boolean;
  error?: string | null;
  compileError?: string | null;
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
  onRequestChange,
  onCompile,
  onRun,
}: WorkflowInputProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0D0D0F] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-[#71717A]">&gt;</span>
          <label className="text-sm font-semibold text-zinc-100">Workflow Request</label>
        </div>
        <Badge className="text-[10px] font-mono bg-[#17171A] text-[#71717A] border border-white/[0.08] hover:bg-[#17171A]">
          Seeded runner
        </Badge>
      </div>
      <Textarea
        className="min-h-[120px] resize-none text-sm leading-relaxed border-white/[0.06] bg-[#0A0A0A] text-zinc-100 placeholder:text-[#71717A] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/40"
        value={request}
        onChange={(event) => onRequestChange?.(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onCompile}
          disabled={isCompiling || isLoading}
          className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
        >
          {isCompiling ? "Compiling..." : "Compile workflow"}
        </Button>
        <Button
          onClick={onRun}
          disabled={isLoading || isCompiling}
          className="bg-violet-600 hover:bg-violet-500 text-white shadow-sm"
        >
          {isLoading ? "Running..." : "Run workflow"}
        </Button>
        <span className="text-xs text-[#71717A]">
          Workflow runs against seeded workplace data only
        </span>
      </div>
      {compileError ? (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-2">{compileError}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-2">{error}</p>
      ) : null}
    </div>
  );
}
