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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Workflow Request</label>
        <Badge variant="outline" className="text-xs">
          Seeded runner
        </Badge>
      </div>
      <Textarea
        className="min-h-[120px] resize-none text-sm leading-relaxed"
        value={request}
        onChange={(event) => onRequestChange?.(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onCompile}
          disabled={isCompiling || isLoading}
        >
          {isCompiling ? "Compiling..." : "Compile workflow"}
        </Button>
        <Button onClick={onRun} disabled={isLoading || isCompiling}>
          {isLoading ? "Running..." : "Run workflow"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Workflow runs against seeded workplace data only
        </span>
      </div>
      {compileError ? (
        <p className="text-xs text-red-600">{compileError}</p>
      ) : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
