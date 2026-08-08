"use client";
import { useState } from "react";
import { api } from "@/lib/api";

interface SourceItem {
  product_name: string;
  microplastic_type: string;
  location: string | null;
  publication_link: string | null;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await api.get("/search", { params: { q: query } });
      setAnswer(res.data.answer);
      setSources(res.data.sources);
    } catch (err) {
      setError("Search failed. The server may be waking up — try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-bold text-ink mb-2">
          Ask the depths.
        </h1>
        <p className="text-ink-muted font-body">
          Search grounded in real research entries — every answer cites its sources, or tells you when it doesn't know.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          className="input-field"
          placeholder="e.g. Are polyester fibers found in wastewater?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-primary whitespace-nowrap" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="text-risk-high font-mono text-sm">{error}</p>}

      {answer && (
        <div className="panel p-6 space-y-4">
          <p className="text-ink font-body leading-relaxed">{answer}</p>
          {sources.length > 0 && (
            <div className="pt-4 border-t border-white/5 space-y-2">
              <p className="font-mono text-xs text-ink-muted uppercase tracking-wide">Sources</p>
              {sources.map((s, i) => (
                <div key={i} className="font-mono text-sm text-ink-muted">
                  [{i + 1}] {s.product_name} — {s.microplastic_type}
                  {s.location && ` · ${s.location}`}
                  {s.publication_link && (
                    <a href={s.publication_link} target="_blank" className="text-seafoam ml-2 hover:underline">
                      source ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
