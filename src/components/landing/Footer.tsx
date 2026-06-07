import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="px-6 py-10">
      <Separator className="mb-8" />
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium">Agent Workflow Lab</p>
        <p className="text-xs text-muted-foreground">
          A workflow testing sandbox for AI WorkOS teams. Phase 0 — static UI
          demo.
        </p>
      </div>
    </footer>
  );
}
