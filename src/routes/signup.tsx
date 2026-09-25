import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell, Field, inputCls } from "@/components/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Elevora" },
      { name: "description", content: "Create your Elevora account and start your hackathon journey." },
      { property: "og:title", content: "Create your Elevora account" },
      { property: "og:description", content: "Join Elevora to discover hackathons, find teammates and nail your demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignupPage,
});

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage() {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Full name is required";
    if (!f.email.trim()) er.email = "Email is required";
    else if (!emailRe.test(f.email.trim())) er.email = "Enter a valid email address";
    if (!f.password) er.password = "Password is required";
    else if (f.password.length < 8) er.password = "Password must be at least 8 characters";
    if (!f.confirm) er.confirm = "Please confirm your password";
    else if (f.confirm !== f.password) er.confirm = "Passwords do not match";
    setErrors(er);
    setDone(Object.keys(er).length === 0);
  };

  return (
    <AuthShell title="Create your Elevora account" subtitle="Start your next hackathon with the whole toolkit beside you.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field id="name" label="Full name" error={errors.name}>
          <input id="name" autoComplete="name" maxLength={100} value={f.name} onChange={set("name")} placeholder="Ada Lovelace" className={inputCls} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" maxLength={255} value={f.email} onChange={set("email")} placeholder="you@university.edu" className={inputCls} />
        </Field>
        <Field id="password" label="Password" error={errors.password}>
          <input id="password" type="password" autoComplete="new-password" maxLength={128} value={f.password} onChange={set("password")} placeholder="At least 8 characters" className={inputCls} />
        </Field>
        <Field id="confirm" label="Confirm password" error={errors.confirm}>
          <input id="confirm" type="password" autoComplete="new-password" maxLength={128} value={f.confirm} onChange={set("confirm")} placeholder="Repeat your password" className={inputCls} />
        </Field>
        <button type="submit" className="btn-primary w-full rounded-full py-3 text-sm font-semibold">Create Account</button>
        {done && <p className="text-center text-xs text-muted-foreground">Looks good — account creation will be enabled soon.</p>}
      </form>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-gradient">Login</Link>
      </p>
    </AuthShell>
  );
}
