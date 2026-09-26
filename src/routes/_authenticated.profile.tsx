import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Field, inputCls } from "@/components/AuthShell";

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
  component: ProfilePage,
});

type Form = { full_name: string; college: string; skills: string; github_url: string; portfolio_url: string; bio: string };
const empty: Form = { full_name: "", college: "", skills: "", github_url: "", portfolio_url: "", bio: "" };

const isUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [f, setF] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  useEffect(() => {
    (async () => {
      const { data: u, error: ue } = await supabase.auth.getUser();
      if (ue || !u.user) {
        setLoadError("Could not load your account.");
        setLoading(false);
        return;
      }
      setUserId(u.user.id);
      setEmail(u.user.email ?? "");
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, college, skills, github_url, portfolio_url, bio")
        .eq("user_id", u.user.id)
        .maybeSingle();
      if (error) setLoadError("Could not load your profile. Please refresh to try again.");
      else if (data) setF(data);
      else setF({ ...empty, full_name: (u.user.user_metadata?.["full_name"] as string) ?? "" });
      setLoading(false);
    })();
  }, []);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const er: Partial<Record<keyof Form, string>> = {};
    if (!f.full_name.trim()) er.full_name = "Full name is required";
    if (f.github_url.trim() && !isUrl(f.github_url.trim())) er.github_url = "Enter a valid URL (https://…)";
    if (f.portfolio_url.trim() && !isUrl(f.portfolio_url.trim())) er.portfolio_url = "Enter a valid URL (https://…)";
    setErrors(er);
    setStatus(null);
    if (Object.keys(er).length) return;
    setSaving(true);
    const payload = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()])) as Form;
    const { error } = await supabase.from("profiles").upsert({ user_id: userId, ...payload });
    setSaving(false);
    if (error) setStatus({ ok: false, text: "Could not save your profile. Please try again." });
    else {
      setF(payload);
      setStatus({ ok: true, text: "Profile saved." });
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-3xl border border-border bg-surface/70 p-6 backdrop-blur-xl sm:p-8">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your profile…
          </div>
        ) : loadError ? (
          <p className="py-16 text-center text-sm text-destructive">{loadError}</p>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="full_name" label="Full name" error={errors.full_name}>
                <input id="full_name" maxLength={100} value={f.full_name} onChange={set("full_name")} className={inputCls} />
              </Field>
              <Field id="email" label="Email">
                <input id="email" value={email} readOnly disabled className={`${inputCls} opacity-60`} />
              </Field>
              <Field id="college" label="College">
                <input id="college" maxLength={150} value={f.college} onChange={set("college")} placeholder="Your university or college" className={inputCls} />
              </Field>
              <Field id="skills" label="Skills">
                <input id="skills" maxLength={300} value={f.skills} onChange={set("skills")} placeholder="React, Python, UI design" className={inputCls} />
              </Field>
              <Field id="github_url" label="GitHub URL" error={errors.github_url}>
                <input id="github_url" type="url" maxLength={255} value={f.github_url} onChange={set("github_url")} placeholder="https://github.com/username" className={inputCls} />
              </Field>
              <Field id="portfolio_url" label="Portfolio URL" error={errors.portfolio_url}>
                <input id="portfolio_url" type="url" maxLength={255} value={f.portfolio_url} onChange={set("portfolio_url")} placeholder="https://yoursite.com" className={inputCls} />
              </Field>
            </div>
            <Field id="bio" label="Short bio">
              <textarea id="bio" rows={4} maxLength={500} value={f.bio} onChange={set("bio")} placeholder="Tell teammates and mentors a little about yourself" className={`${inputCls} resize-none`} />
            </Field>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving…" : "Save profile"}
              </button>
              {status && <p className={`text-sm ${status.ok ? "text-primary" : "text-destructive"}`}>{status.text}</p>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
