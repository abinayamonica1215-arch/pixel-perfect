import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Users,
  GraduationCap,
  Compass,
  Presentation,
  ArrowRight,
} from "lucide-react";
import heroOrb from "@/assets/hero-orb.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elevora — Your AI-Powered Hackathon Operating System" },
      {
        name: "description",
        content:
          "Elevora guides students from hackathon discovery to final demo with AI idea validation, team building, mentorship and demo coaching.",
      },
      { property: "og:title", content: "Elevora — AI-Powered Hackathon Operating System" },
      {
        property: "og:description",
        content:
          "Discover hackathons, validate ideas, find teammates, get mentorship and nail your demo — all in one platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Sparkles,
    title: "AI Idea Validator",
    body: "Pressure-test your concept against the theme, judging criteria and what's actually buildable in 36 hours.",
  },
  {
    icon: Users,
    title: "Smart Team Builder",
    body: "Match with teammates by skill, timezone and working style instead of scrolling endless Discord threads.",
  },
  {
    icon: GraduationCap,
    title: "Mentor Marketplace",
    body: "Book short sessions with engineers, designers and past winners exactly when you're stuck.",
  },
  {
    icon: Compass,
    title: "Hackathon Explorer",
    body: "A curated feed of online and campus hackathons filtered by stack, prize, deadline and eligibility.",
  },
  {
    icon: Presentation,
    title: "AI Demo Coach",
    body: "Rehearse your pitch and get feedback on story, pacing and the questions judges will ask.",
  },
];

const problems = [
  "Choosing which hackathon is actually worth the weekend",
  "Validating an idea before wasting two days on it",
  "Finding teammates who complement your skills",
  "Picking a tech stack the team can ship with",
  "Reaching mentors who answer in time to matter",
  "Turning a working build into a convincing demo",
];

const steps = [
  { n: "01", title: "Discover", body: "Find the hackathons that fit your goals and skill level." },
  { n: "02", title: "Validate", body: "Sharpen your idea with AI feedback before you commit." },
  { n: "03", title: "Build", body: "Assemble a team and lock a stack you can ship." },
  { n: "04", title: "Get Guidance", body: "Bring mentors in at the moments that decide the project." },
  { n: "05", title: "Present", body: "Rehearse, refine and deliver a demo that lands." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg btn-primary" />
            <span className="font-display text-lg font-bold tracking-tight">Elevora</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#problem" className="transition-colors hover:text-foreground">Problem</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          </nav>
          <Link
            to="/login"
            className="btn-primary rounded-full px-5 py-2 text-sm font-semibold"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="halo pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground">
              For students who ship
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Your <span className="text-gradient">AI-Powered</span> Hackathon Operating System
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Elevora walks with you through the whole hackathon journey — discovering the right
              event, validating your idea, forming a team, getting mentorship and preparing a demo
              that wins the room.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="btn-ghost rounded-full px-7 py-3 text-sm font-semibold">
                Explore Hackathons
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card overflow-hidden rounded-3xl p-2">
              <img
                src={heroOrb}
                alt="Abstract glowing network sphere representing the Elevora AI platform"
                width={1280}
                height={960}
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
          Hackathons are won long before the demo
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Most teams lose time on the same six problems — and they all hit before a single line of
          code is written.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <li key={p} className="glass-card rounded-2xl p-5 text-sm leading-relaxed text-muted-foreground">
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Solution */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="glass-card rounded-3xl p-8 sm:p-12">
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            One ecosystem instead of ten open tabs
          </h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
            Elevora brings AI assistance, collaboration, mentorship and learning together in a
            single place. The AI understands your event, your team and your build, so every
            suggestion is grounded in what you're actually making — and every mentor, teammate and
            rehearsal lives beside it.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold sm:text-4xl">Core features</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="glass-card rounded-2xl p-6">
              <div className="btn-primary inline-flex h-11 w-11 items-center justify-center rounded-xl">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="glass-card rounded-2xl p-6">
              <span className="text-gradient font-display text-2xl font-bold">{s.n}</span>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="start" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="halo relative overflow-hidden rounded-3xl border border-border px-8 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            Your next hackathon starts here
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Go from an empty idea doc to a demo you're proud of — with Elevora beside you at every
            step.
          </p>
          <a
            href="#start"
            className="btn-primary mt-9 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
          >
            Start Your Hackathon Journey <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md btn-primary" />
            <span className="font-display font-bold">Elevora</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#problem" className="transition-colors hover:text-foreground">Problem</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#start" className="transition-colors hover:text-foreground">Get started</a>
          </nav>
          <p className="text-xs text-muted-foreground">© 2026 Elevora</p>
        </div>
      </footer>
    </div>
  );
}
