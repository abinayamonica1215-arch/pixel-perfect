import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  Cpu,
  Rocket,
  ShieldCheck,
  AlertTriangle,
  Swords,
  CheckCircle2,
  Brain,
  Loader2,
  RefreshCw,
  Pencil,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { validateIdea } from "@/lib/idea-validator/validate-idea.functions";
import type { IdeaValidatorResult } from "@/lib/idea-validator/schema";

const title = "AI Idea Validator";
const description = "Validate your hackathon idea before you build.";

type Status = "idle" | "loading" | "error" | "results";

interface FormState {
  ideaName: string;
  problemStatement: string;
  solutionDescription: string;
  targetUsers: string;
  techPreferences: string;
}

const EMPTY_FORM: FormState = {
  ideaName: "",
  problemStatement: "",
  solutionDescription: "",
  targetUsers: "",
  techPreferences: "",
};

function ScoreRing({ value, label, icon: Icon }: { value: number; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-secondary" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
          <span className="mt-0.5 text-lg font-bold">{value}</span>
        </div>
      </div>
      <span className="text-center text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function ScoreBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </span>
        <span className="font-semibold text-foreground">{value}/100</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-violet transition-all duration-700 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function LoadingState() {
  const steps = [
    "Analyzing your idea…",
    "Evaluating problem-solution fit…",
    "Assessing feasibility…",
    "Scanning competitive landscape…",
    "Generating recommendations…",
  ];
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface/50 px-6 py-20 text-center backdrop-blur">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </div>
      <h3 className="mt-6 text-lg font-bold">Analyzing your idea…</h3>
      <ul className="mt-5 space-y-2 text-left text-sm text-muted-foreground">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            </span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/40 bg-destructive/10 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 ring-1 ring-destructive/30">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="mt-5 text-lg font-bold">Validation failed</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message || "We couldn't complete the analysis. Please check your connection and try again."}
      </p>
      <Button onClick={onRetry} variant="outline" className="mt-5">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

function ResultsLayout({ result }: { result: IdeaValidatorResult }) {
  return (
    <div className="space-y-6">
      {/* Overall score + score rings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="h-5 w-5 text-primary" />
            Validation Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface/40 p-4">
              <ScoreRing value={result.overallScore} label="Overall Score" icon={Gauge} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:col-span-3 sm:grid-cols-3">
              <ScoreRing value={result.innovationScore} label="Innovation" icon={Sparkles} />
              <ScoreRing value={result.feasibilityScore} label="Feasibility" icon={Rocket} />
              <ScoreRing value={result.problemSolutionFitScore} label="Problem-Solution Fit" icon={ShieldCheck} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Competition Analysis */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Swords className="h-4 w-4 text-primary" />
              Competition Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90">{result.competitionAnalysis}</p>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Risks / Gaps */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Risks / Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.risksAndGaps.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Suggested Features */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Suggested Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.suggestedFeatures.map((item, i) => (
                <Badge key={i} variant="secondary">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Tech Stack */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="h-4 w-4 text-primary" />
            Recommended Tech Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.recommendedTechStack.map((item, i) => (
              <Badge key={i} variant="outline" className="border-primary/30 bg-primary/10 text-foreground">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary / Verdict */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-primary" />
            AI Summary / Verdict
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/90">{result.aiSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/idea-validator")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: IdeaValidatorPage,
});

function IdeaValidatorPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<IdeaValidatorResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const requiredFields: { key: keyof FormState; label: string }[] = [
    { key: "ideaName", label: "Idea name" },
    { key: "problemStatement", label: "Problem statement" },
    { key: "solutionDescription", label: "Solution description" },
    { key: "targetUsers", label: "Target users" },
  ];

  const missing = requiredFields.filter((f) => !form[f.key].trim());
  const requiredFilled = missing.length === 0;

  const handleValidate = async () => {
    setTouched(true);
    if (!requiredFilled) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const response = await validateIdea({ data: form });
      if (response.ok) {
        setResult(response.result);
        setStatus("results");
      } else {
        setErrorMsg(response.error);
        setStatus("error");
      }
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : "An unexpected error occurred.",
      );
      setStatus("error");
    }
  };

  const handleEdit = () => {
    setStatus("idle");
    setTouched(false);
  };

  const handleNewIdea = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setStatus("idle");
    setTouched(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
      </div>

      {status === "loading" ? (
        <LoadingState />
      ) : status === "error" ? (
        <ErrorState message={errorMsg} onRetry={() => setStatus("idle")} />
      ) : status === "results" && result ? (
        <div className="space-y-6">
          <ResultsLayout result={result} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleNewIdea} variant="default" className="btn-primary">
              <RefreshCw className="h-4 w-4" />
              Validate Another Idea
            </Button>
            <Button onClick={handleEdit} variant="outline" className="btn-ghost">
              <Pencil className="h-4 w-4" />
              Edit Idea
            </Button>
          </div>
        </div>
      ) : (
        /* Input form — initial state, clean and focused */
        <Card className="glass-card mx-auto max-w-2xl">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="space-y-2">
              <Label htmlFor="ideaName">
                Project / Idea Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ideaName"
                placeholder="e.g. AI-Powered Study Planner"
                value={form.ideaName}
                onChange={(e) => update("ideaName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemStatement">
                Problem Statement <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="problemStatement"
                placeholder="What problem does your idea solve? Who is affected by it?"
                rows={4}
                value={form.problemStatement}
                onChange={(e) => update("problemStatement", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solutionDescription">
                Solution Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="solutionDescription"
                placeholder="How does your idea solve the problem? What does it do?"
                rows={4}
                value={form.solutionDescription}
                onChange={(e) => update("solutionDescription", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUsers">
                Target Users <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="targetUsers"
                placeholder="Who will use this? Students, developers, small businesses…"
                rows={3}
                value={form.targetUsers}
                onChange={(e) => update("targetUsers", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="techPreferences">
                Technology Preferences{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="techPreferences"
                placeholder="e.g. React, Python, Supabase, mobile-first"
                value={form.techPreferences}
                onChange={(e) => update("techPreferences", e.target.value)}
              />
            </div>

            {touched && missing.length > 0 && (
              <p className="text-sm text-destructive">
                Please fill in: {missing.map((m) => m.label).join(", ")}.
              </p>
            )}

            <Button
              onClick={handleValidate}
              disabled={!requiredFilled}
              size="lg"
              className="btn-primary w-full"
            >
              <Sparkles className="h-4 w-4" />
              Validate My Idea
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
