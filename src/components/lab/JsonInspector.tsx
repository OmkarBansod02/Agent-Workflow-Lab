"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DemoWorkspaceData } from "@/lib/types";

interface JsonInspectorProps {
  data: DemoWorkspaceData;
}

export function JsonInspector({ data }: JsonInspectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Raw JSON Trace</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border border-border/60">
          <pre className="p-4 text-xs leading-relaxed font-mono text-muted-foreground">
            {JSON.stringify(data, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
