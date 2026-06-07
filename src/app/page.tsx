import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DemoWorkspace } from "@/components/landing/DemoWorkspace";
import { WhyThisMatters } from "@/components/landing/WhyThisMatters";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/60">
        <span className="text-sm font-semibold tracking-tight">
          Agent Workflow Lab
        </span>
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
