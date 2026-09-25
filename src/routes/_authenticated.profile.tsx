import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { PlaceholderPage } from "@/components/app/AppShell";

const title = "Profile";
const description = "Manage how you appear to teammates, mentors and organizers.";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PlaceholderPage title={title} description={description} icon={User} />,
});
