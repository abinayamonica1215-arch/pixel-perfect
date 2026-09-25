import { createFileRoute } from "@tanstack/react-router";
import { Presentation } from "lucide-react";
import { PlaceholderPage } from "@/components/app/AppShell";

const title = "AI Demo Coach";
const description = "Rehearse your pitch and get AI coaching on your demo.";

export const Route = createFileRoute("/_authenticated/demo-coach")({
  head: () => ({
    meta: [
      { title: `${title} — Elevora` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Elevora` },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PlaceholderPage title={title} description={description} icon={Presentation} />,
});
