import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DemoWorkspace } from "@/components/landing/DemoWorkspace";
import { WhyThisMatters } from "@/components/landing/WhyThisMatters";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">
          Agent Workflow Lab
        </span>
        <Button asChild size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-8 px-3.5">
          <Link href="/app">Open demo</Link>
        </Button>
      </header>
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <DemoWorkspace />
        <WhyThisMatters />
      </main>
      <Footer />
    </div>
  );
}
