import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/app/AppShell";

const title = "Learning Hub";
const description = "Curated resources to level up before your next hackathon.";

export const Route = createFileRoute("/_authenticated/learning")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PlaceholderPage title={title} description={description} icon={BookOpen} />,
});
