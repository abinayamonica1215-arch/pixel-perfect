import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { PlaceholderPage } from "@/components/app/AppShell";

const title = "Hackathon Explorer";
const description = "Discover hackathons that match your skills, interests and schedule.";

export const Route = createFileRoute("/_authenticated/hackathons")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PlaceholderPage title={title} description={description} icon={Trophy} />,
});
