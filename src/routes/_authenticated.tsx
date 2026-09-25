import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
