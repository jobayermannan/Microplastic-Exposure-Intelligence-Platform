"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/store/authStore";

export default function NewResearchEntry() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [form, setForm] = useState({
    product_name: "",
    microplastic_type: "",
    concentration: "",
    detection_method: "",
    publication_link: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="max-w-md mx-auto panel p-6 text-center space-y-3">
        <p className="text-ink font-body">You need to log in as a researcher to submit data.</p>
        <button onClick={() => router.push("/login")} className="btn-primary">Go to login</button>
      </div>
    );
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post("/research", {
        ...form,
        concentration: form.concentration ? parseFloat(form.concentration) : null,
      });
      setSuccess(true);
      setForm({ product_name: "", microplastic_type: "", concentration: "", detection_method: "", publication_link: "", location: "" });
    } catch (err) {
      setError(getErrorMessage(err, "Submission failed. Check your entries and try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Submit research data.</h1>
        <p className="text-ink-muted font-body text-sm">
          New entries are embedded and become searchable immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Product name</label>
          <input className="input-field mt-1" required value={form.product_name} onChange={(e) => update("product_name", e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Microplastic type</label>
          <input className="input-field mt-1" required value={form.microplastic_type} onChange={(e) => update("microplastic_type", e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Concentration</label>
          <input className="input-field mt-1" type="number" step="any" value={form.concentration} onChange={(e) => update("concentration", e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Detection method</label>
          <input className="input-field mt-1" value={form.detection_method} onChange={(e) => update("detection_method", e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Location</label>
          <input className="input-field mt-1" value={form.location} onChange={(e) => update("location", e.target.value)} />
        </div>
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Publication link</label>
          <input className="input-field mt-1" type="url" value={form.publication_link} onChange={(e) => update("publication_link", e.target.value)} />
        </div>
        {error && <p className="text-risk-high font-mono text-xs">{error}</p>}
        {success && <p className="text-seafoam font-mono text-xs">Entry submitted and indexed.</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Submitting…" : "Submit entry"}
        </button>
      </form>
    </div>
  );
}
