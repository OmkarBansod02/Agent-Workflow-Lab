"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_REQUEST } from "@/lib/demo-data";

export function WorkflowInput() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Workflow Request</label>
        <Badge variant="outline" className="text-xs">
          Static demo
        </Badge>
      </div>
      <Textarea
        className="min-h-[120px] resize-none text-sm leading-relaxed"
        defaultValue={DEMO_REQUEST}
        readOnly
      />
      <div className="flex items-center gap-3">
        <Button>Run workflow</Button>
        <span className="text-xs text-muted-foreground">
          Workflow runs against seeded workplace data only
        </span>
      </div>
    </div>
  );
}
