import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <Badge variant="secondary" className="mb-6 text-xs font-medium tracking-wide uppercase">
        Workflow Testing Lab
      </Badge>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
        Test agent workflows before they touch real work
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Agent Workflow Lab runs AI workflows against a realistic seeded
        workplace, creates draft actions, and evaluates readiness before
        execution.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Button asChild size="lg">
          <Link href="/app">Open demo</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="#how-it-works">How it works</Link>
        </Button>
      </div>
    </section>
  );
}
