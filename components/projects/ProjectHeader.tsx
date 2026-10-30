"use client";

import { Settings, UserPlus, Plus } from "lucide-react";
import { Project, ProjectStatus } from "@/lib/api";

interface ProjectHeaderProps {
  project: Project | null;
  invitationsCount: number;
  onUpdateStatus: (status: ProjectStatus) => void;
  onOpenSettings: () => void;
  onOpenInvite: () => void;
  onOpenAddTask: () => void;
}

export default function ProjectHeader({
  project,
  invitationsCount,
  onUpdateStatus,
  onOpenSettings,
  onOpenInvite,
  onOpenAddTask,
}: ProjectHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 border-white/15">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={project?.status || "active"}
            onChange={(e) => onUpdateStatus(e.target.value as ProjectStatus)}
            className="bg-[var(--color-taskr-surface)] text-xs font-semibold px-2.5 py-1 rounded-full text-[var(--color-taskr-blue)] border border-[var(--color-taskr-blue)]/30 capitalize cursor-pointer"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {project?.title || "Project Workspace"}
        </h1>
        <p className="text-xs text-slate-300">
          {project?.description || "Collaborative workspace details and board."}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={onOpenSettings}
          className="glass-card px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={onOpenInvite}
          className="glass-card px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[var(--color-taskr-purple)]" />
          <span>Invite Team ({invitationsCount})</span>
        </button>

        <button
          onClick={onOpenAddTask}
          className="glass-button-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}