import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell, Field, inputCls } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Elevora" },
      { name: "description", content: "Log in to Elevora, your AI-powered hackathon operating system." },
      { property: "og:title", content: "Login — Elevora" },
      { property: "og:description", content: "Log in to continue your hackathon journey with Elevora." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!email.trim()) er.email = "Email is required";
    else if (!emailRe.test(email.trim())) er.email = "Enter a valid email address";
    if (!password) er.password = "Password is required";
    else if (password.length < 8) er.password = "Password must be at least 8 characters";
    setErrors(er);
    setDone(Object.keys(er).length === 0);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to pick up where your team left off.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" className={inputCls} />
        </Field>
        <Field id="password" label="Password" error={errors.password}>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} autoComplete="current-password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputCls} pr-11`} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex justify-end">
          <button type="button" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</button>
        </div>
        <button type="submit" className="btn-primary w-full rounded-full py-3 text-sm font-semibold">Login</button>
        {done && <p className="text-center text-xs text-muted-foreground">Looks good — sign-in will be enabled soon.</p>}
      </form>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="font-medium text-gradient">Create account</Link>
      </p>
    </AuthShell>
  );
}
