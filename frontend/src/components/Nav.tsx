"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Nav() {
  const { token, email, logout } = useAuthStore();

  return (
    <nav className="border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-lg tracking-tight text-ink">
          Depth<span className="text-seafoam">line</span>
        </Link>
        <div className="flex items-center gap-6 font-mono text-sm text-ink-muted">
          <Link href="/" className="hover:text-seafoam transition-colors">search</Link>
          <Link href="/predict" className="hover:text-seafoam transition-colors">predict</Link>
          {token ? (
            <>
              <Link href="/research/new" className="hover:text-seafoam transition-colors">submit data</Link>
              <span className="text-ink-muted">{email}</span>
              <button onClick={logout} className="hover:text-risk-high transition-colors">logout</button>
            </>
          ) : (
            <Link href="/login" className="hover:text-seafoam transition-colors">login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
