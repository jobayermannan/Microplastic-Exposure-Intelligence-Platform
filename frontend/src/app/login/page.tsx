"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, { email, password });
      setAuth(res.data.access_token, email);
      router.push("/research/new");
    } catch (err) {
      setError(getErrorMessage(err, "Login/registration failed. Check your details and try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">
          {mode === "login" ? "Welcome back." : "Join as a researcher."}
        </h1>
        <p className="text-ink-muted font-body text-sm">
          Researcher access lets you submit new data entries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Email</label>
          <input className="input-field mt-1" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Password</label>
          <input className="input-field mt-1" type="password" required minLength={6}
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-risk-high font-mono text-xs">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Register"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="text-seafoam font-mono text-sm hover:underline block mx-auto"
      >
        {mode === "login" ? "Need an account? Register" : "Already registered? Log in"}
      </button>
    </div>
  );
}
