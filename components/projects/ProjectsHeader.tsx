"use client";

import { FolderKanban, Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onOpenCreateModal: () => void;
}

export default function ProjectsHeader({ onOpenCreateModal }: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <FolderKanban className="w-7 h-7 text-[var(--color-taskr-blue)]" />
          <span>Project Workspaces</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your collaborative project workspaces, tasks, and team permissions.
        </p>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="glass-button-primary text-sm px-5 py-2.5 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>New Project</span>
      </button>
    </div>
  );
}