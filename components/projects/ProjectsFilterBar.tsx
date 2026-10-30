"use client";

import { Search } from "lucide-react";
import { ProjectStatus, ProjectTypeFilter } from "@/lib/api";

interface ProjectsFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ProjectStatus | "all";
  setStatusFilter: (status: ProjectStatus | "all") => void;
  typeFilter: ProjectTypeFilter | "all";
  setTypeFilter: (type: ProjectTypeFilter | "all") => void;
  totalCount: number;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function ProjectsFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  totalCount,
  onSearchSubmit,
}: ProjectsFilterBarProps) {
  return (
    <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <form onSubmit={onSearchSubmit} className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search project titles..."
          className="glass-input w-full pl-10 py-2 text-xs"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
          className="glass-input text-xs py-1.5 px-3 bg-[var(--color-taskr-surface)] text-slate-200 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ProjectTypeFilter | "all")}
          className="glass-input text-xs py-1.5 px-3 bg-[var(--color-taskr-surface)] text-slate-200 cursor-pointer"
        >
          <option value="all">All Access</option>
          <option value="mine">Created By Me</option>
          <option value="member">Shared Member</option>
        </select>

        <div className="text-xs text-slate-400 ml-auto md:ml-2">
          Total: <span className="text-white font-medium">{totalCount}</span>
        </div>
      </div>
    </div>
  );
}