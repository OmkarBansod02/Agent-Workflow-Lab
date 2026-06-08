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
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-zinc-400">&gt;</span>
          <label className="text-sm font-semibold text-zinc-900">Workflow Request</label>
        </div>
        <Badge className="text-[10px] font-mono bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-100">
          Seeded runner
        </Badge>
      </div>
      <Textarea
        className="min-h-[120px] resize-none text-sm leading-relaxed border-zinc-200 bg-zinc-50/50 focus-visible:ring-blue-500/30 focus-visible:border-blue-300"
        value={request}
        onChange={(event) => onRequestChange?.(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onCompile}
          disabled={isCompiling || isLoading}
          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
        >
          {isCompiling ? "Compiling..." : "Compile workflow"}
        </Button>
        <Button
          onClick={onRun}
          disabled={isLoading || isCompiling}
          className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
        >
          {isLoading ? "Running..." : "Run workflow"}
        </Button>
        <span className="text-xs text-zinc-400">
          Workflow runs against seeded workplace data only
        </span>
      </div>
      {compileError ? (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">{compileError}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">{error}</p>
      ) : null}
    </div>
  );
}
