import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/app/AppShell";

const title = "Smart Team Builder";
const description = "Find teammates whose skills complement yours.";

export const Route = createFileRoute("/_authenticated/team-builder")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PlaceholderPage title={title} description={description} icon={Users} />,
});
