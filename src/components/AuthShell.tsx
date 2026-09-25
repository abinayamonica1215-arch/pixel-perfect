import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="halo pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg btn-primary" />
            <span className="font-display text-lg font-bold tracking-tight">Elevora</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
        <div className="flex flex-1 items-center py-10">
          <div className="w-full rounded-3xl border border-border bg-surface/70 p-7 backdrop-blur-xl sm:p-9" style={{ boxShadow: "var(--shadow-glow)" }}>
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, error, children, id }: { label: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";
