import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { PlaceholderPage } from "@/components/app/AppShell";

const title = "Help & Support";
const description = "Answers to common questions and ways to reach our team.";

export const Route = createFileRoute("/_authenticated/help")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PlaceholderPage title={title} description={description} icon={HelpCircle} />,
});
