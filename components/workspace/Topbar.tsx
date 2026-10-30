"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";

export default function Topbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/projects?title=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[var(--color-taskr-surface)]/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Quick Search */}
      <form onSubmit={handleSearch} className="relative w-72">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks or projects..."
          className="glass-input w-full pl-10 py-1.5 text-xs rounded-xl"
        />
      </form>

      {/* Topbar Actions */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[var(--color-taskr-done)] absolute top-1.5 right-1.5 animate-pulse" />
        </button>

        <button
          onClick={() => router.push("/projects")}
          className="glass-button-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>
    </header>
  );
}