import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/AuthShell";

type OAuthResult = { data: any; error: { message: string } | null };
const oauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
    approveAuthorization: (id: string) => Promise<OAuthResult>;
    denyAuthorization: (id: string) => Promise<OAuthResult>;
  };
}).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Authorize access — Elevora" },
      { name: "description", content: "Approve an app to access your Elevora account." },
      { property: "og:title", content: "Authorize access — Elevora" },
      { property: "og:description", content: "Approve an app to access your Elevora account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s["authorization_id"] === "string" ? s["authorization_id"] : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ href: `/login?next=${encodeURIComponent(location.href)}` });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.searchStr).get("authorization_id")!;
    const { data, error } = await oauth.getAuthorizationDetails(id);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <AuthShell title="Authorization failed" subtitle="This request is invalid or expired.">
      <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
    </AuthShell>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = details?.client?.name ?? "An app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    const target = data?.redirect_url ?? data?.redirect_to;
    if (error || !target) {
      setBusy(false);
      setError(error?.message ?? "No redirect returned.");
      return;
    }
    window.location.href = target;
  }

  return (
    <AuthShell title={`Connect ${name}`} subtitle={`${name} wants to read and update your Elevora profile as you.`}>
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">
        <button disabled={busy} onClick={() => decide(true)} className="btn-primary flex-1 justify-center">Approve</button>
        <button disabled={busy} onClick={() => decide(false)} className="btn-ghost flex-1 justify-center">Deny</button>
      </div>
    </AuthShell>
  );
}
