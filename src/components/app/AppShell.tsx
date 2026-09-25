import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { HelpCircle, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { navSections } from "./nav";
import { cn } from "@/lib/utils";

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const item = (to: string, title: string, Icon: React.ComponentType<{ className?: string }>) => {
    const active = path === to;
    return (
      <Link
        key={to}
        to={to}
        onClick={onNavigate}
        title={collapsed ? title : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          collapsed && "justify-center px-0",
          active
            ? "bg-primary/15 text-foreground ring-1 ring-primary/40 shadow-[var(--shadow-glow)]"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        )}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-primary" : "group-hover:text-primary")} />
        {!collapsed && <span className="truncate">{title}</span>}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className={cn("flex h-16 items-center gap-2 px-5", collapsed && "justify-center px-0")}>
        <div className="h-7 w-7 shrink-0 rounded-lg btn-primary" />
        {!collapsed && <span className="font-display text-lg font-bold tracking-tight">Elevora</span>}
      </Link>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navSections.map((s) => (
          <div key={s.label}>
            {!collapsed ? (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
            ) : (
              <div className="mx-auto mb-2 h-px w-6 bg-border" />
            )}
            <div className="space-y-1">{s.items.map((i) => item(i.to, i.title, i.icon))}</div>
          </div>
        ))}
      </nav>
      <div className="space-y-1 border-t border-border px-3 py-3">
        {item("/help", "Help & Support", HelpCircle)}
        <Link
          to="/login"
          onClick={onNavigate}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
      <div className={cn("flex items-center gap-3 border-t border-border p-4", collapsed && "justify-center px-0")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full btn-primary text-sm font-bold">SU</div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Student User</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    if (mq.matches) setCollapsed(true);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop / tablet */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border bg-surface/60 backdrop-blur-xl transition-[width] duration-300 md:block",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <SidebarBody collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-[280px] border-r border-border bg-surface shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarBody collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:inline-flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
          <span className="font-display font-bold md:hidden">Elevora</span>
        </header>
        <main className="relative flex-1 overflow-hidden">
          <div className="halo pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-60" />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center backdrop-blur">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="mt-5 text-xl font-bold">Coming soon</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">We're building this part of Elevora. Check back shortly.</p>
      </div>
    </div>
  );
}
