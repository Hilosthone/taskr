"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Project } from "@/lib/api";

export interface ProjectStats {
  membersCount: number;
  tasksCount: number;
  completedTasks: number;
}

interface ProjectCardProps {
  project: Project;
  stats: ProjectStats;
  idx: number;
}

export default function ProjectCard({ project, stats, idx }: ProjectCardProps) {
  const progressPct =
    stats.tasksCount > 0
      ? Math.round((stats.completedTasks / stats.tasksCount) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
    >
      <Link
        href={`/projects/${project._id}`}
        className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-5 h-full block group relative overflow-hidden cursor-pointer"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-white group-hover:text-[var(--color-taskr-blue)] transition-colors line-clamp-1">
              {project.title}
            </h2>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--color-taskr-done)]/20 text-[var(--color-taskr-done)] border border-[var(--color-taskr-done)]/30 capitalize shrink-0">
              {project.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {project.description || "No description provided."}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Completion Rate</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--color-taskr-blue)] to-[var(--color-taskr-done)] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{stats.membersCount} Members</span>
            </div>
            <span>
              {stats.completedTasks} / {stats.tasksCount} Tasks
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}