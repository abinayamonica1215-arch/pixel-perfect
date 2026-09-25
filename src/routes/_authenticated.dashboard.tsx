import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { PlaceholderPage } from "@/components/app/AppShell";

const title = "Dashboard";
const description = "Your hackathon journey at a glance: progress, deadlines and next steps.";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PlaceholderPage title={title} description={description} icon={LayoutDashboard} />,
});
