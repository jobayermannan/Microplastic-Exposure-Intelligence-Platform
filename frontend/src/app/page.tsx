"use client";
import { useState, useRef } from "react";

interface SourceItem {
  product_name: string;
  microplastic_type: string;
  location: string | null;
  publication_link: string | null;
}

interface SearchResult {
  answer: string;
  sources: SourceItem[];
}

const SAMPLE_QUERIES = [
  "Are PET fragments found in bottled water?",
  "Polyester fibers in wastewater effluent",
  "Microplastic contamination in table salt",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Record<string, SearchResult>>({});

  async function runSearch(searchQuery: string) {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 1) return;

    const cacheKey = trimmed.toLowerCase();
    if (cacheRef.current[cacheKey]) {
      setError(null);
      setAnswer(cacheRef.current[cacheKey].answer);
      setSources(cacheRef.current[cacheKey].sources);
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error("Search request failed");
      const data: SearchResult = await res.json();
      cacheRef.current[cacheKey] = {
        answer: data.answer,
        sources: data.sources || [],
      };
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch {
      setError("Search failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await runSearch(query);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-bold text-ink mb-2">
          Ask the depths.
        </h1>
        <p className="text-ink-muted font-body">
          Search grounded in real research entries — every answer cites its sources, or tells you when it doesn&apos;t know.
        </p>
      </div>

      <div className="space-y-3">
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-ink-muted">Try:</span>
          {SAMPLE_QUERIES.map((sq) => (
            <button
              key={sq}
              type="button"
              disabled={loading}
              onClick={() => {
                setQuery(sq);
                runSearch(sq);
              }}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-ink-muted hover:text-seafoam hover:border-seafoam/40 transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-risk-high font-mono text-sm">{error}</p>}

      {answer && (
        <div className="panel p-6 space-y-4">
          <p className="text-ink font-body leading-relaxed whitespace-pre-line">{answer}</p>
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
