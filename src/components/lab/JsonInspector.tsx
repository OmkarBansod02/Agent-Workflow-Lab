"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DemoWorkspaceData } from "@/lib/types";

interface JsonInspectorProps {
  data: DemoWorkspaceData;
}

export function JsonInspector({ data }: JsonInspectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-dashed border-border/50">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Raw JSON Trace
            </CardTitle>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
              Debug / Replay
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {isOpen ? "▾ Collapse" : "▸ Expand"}
          </span>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border border-border/40 bg-muted/20">
            <pre className="p-4 text-[11px] leading-relaxed font-mono text-muted-foreground">
              {JSON.stringify(data, null, 2)}
            </pre>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
