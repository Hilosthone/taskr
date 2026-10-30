"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  ArrowUpRight,
  Plus,
  Sparkles,
  Mail,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import {
  userApi,
  projectApi,
  taskApi,
  UserProfile,
  Project,
  Task,
  TaskStatus,
} from "@/lib/api";

// Map OAS 3.0 task status codes to UI labels & styles
const statusMap: Record<
  string,
  { label: string; style: string; next: TaskStatus }
> = {
  todo: {
    label: "To Do",
    style: "bg-slate-700/80 text-slate-200 border border-slate-600/40",
    next: "in-progress",
  },
  "in-progress": {
    label: "Working on it",
    style: "bg-[var(--color-taskr-working)] text-white shadow-sm",
    next: "completed",
  },
  "on-hold": {
    label: "Stuck",
    style: "bg-[var(--color-taskr-stuck)] text-white shadow-sm",
    next: "in-progress",
  },
  review: {
    label: "In Review",
    style: "bg-amber-500 text-white shadow-sm",
    next: "completed",
  },
  completed: {
    label: "Done",
    style: "bg-[var(--color-taskr-done)] text-white shadow-sm",
    next: "todo",
  },
};

interface DashboardTask extends Task {
  projectName?: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch User Profile and Projects concurrently
        const [profileRes, projectsRes] = await Promise.all([
          userApi.getProfile().catch(() => null),
          projectApi.getAll().catch(() => ({ data: { project: [] } })),
        ]);

        if (profileRes?.data) {
          setProfile(profileRes.data);
        }

        const projectList = projectsRes?.data?.project || [];
        setProjects(projectList);

        // Fetch tasks across active projects assigned to current user
        if (projectList.length > 0) {
          const taskPromises = projectList.map(async (project) => {
            try {
              const res = await taskApi.getProjectTasks(project._id, {
                assignedTo: "me",
              });
              const projectTasks = res?.data?.task || [];
              return projectTasks.map((t) => ({
                ...t,
                projectName: project.title,
              }));
            } catch {
              return [];
            }
          });

          const taskResults = await Promise.all(taskPromises);
          setTasks(taskResults.flat());
        }
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        setError("Unable to load workspace data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Live status mutation via PATCH /api/v1/project/{id}/task/{taskId}/status
  const cycleTaskStatus = async (task: DashboardTask) => {
    const currentMeta = statusMap[task.status] || statusMap["todo"];
    const nextStatus = currentMeta.next;

    setUpdatingTaskId(task._id);

    try {
      await taskApi.updateStatus(task.projectId, task._id, nextStatus);

      // Optimistically update state
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Compute live metrics
  const activeProjectsCount = projects.filter((p) => p.status === "active").length;
  const completedTasksCount = tasks.filter((t) => t.status === "completed").length;
  const pendingTasksCount = tasks.filter((t) => t.status !== "completed").length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const stats = [
    {
      name: "Active Projects",
      value: activeProjectsCount.toString(),
      subtext: `${projects.length} total projects`,
      icon: FolderKanban,
      color: "text-[var(--color-taskr-blue)]",
      bg: "bg-[var(--color-taskr-blue)]/15",
    },
    {
      name: "My Pending Tasks",
      value: pendingTasksCount.toString(),
      subtext: "Assigned & active",
      icon: Clock,
      color: "text-[var(--color-taskr-working)]",
      bg: "bg-[var(--color-taskr-working)]/15",
    },
    {
      name: "Completed Tasks",
      value: completedTasksCount.toString(),
      subtext: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "text-[var(--color-taskr-done)]",
      bg: "bg-[var(--color-taskr-done)]/15",
    },
    {
      name: "Total Workspace Tasks",
      value: tasks.length.toString(),
      subtext: "Across all projects",
      icon: Mail,
      color: "text-[var(--color-taskr-purple)]",
      bg: "bg-[var(--color-taskr-purple)]/15",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
        <p className="text-xs text-slate-400">Loading your workspace dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 border-white/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-taskr-blue)]">
            <Sparkles className="w-4 h-4" />
            <span>Workspace Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {profile ? profile.firstname : "User"} 👋
          </h1>
          <p className="text-sm text-slate-300">
            You have {pendingTasksCount} active tasks across {activeProjectsCount} active projects.
          </p>
        </div>

        <Link
          href="/projects"
          className="glass-button-primary text-sm px-5 py-3 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="glass-panel p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400">{stat.subtext}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Projects List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[var(--color-taskr-blue)]" />
              <span>Active Projects</span>
            </h2>
            <Link
              href="/projects"
              className="text-xs text-[var(--color-taskr-blue)] hover:underline font-medium flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="glass-panel p-8 text-center space-y-3">
              <FolderKanban className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No projects found in this workspace yet.</p>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--color-taskr-blue)] font-medium hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create your first project</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 group cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white group-hover:text-[var(--color-taskr-blue)] transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          project.status === "active"
                            ? "bg-[var(--color-taskr-done)]"
                            : "bg-amber-500"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {project.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                      {project.status.replace("_", " ")}
                    </span>
                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Tasks Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-taskr-working)]" />
              <span>Assigned Tasks</span>
            </h2>
          </div>

          <div className="glass-panel p-4 space-y-3">
            <p className="text-xs text-slate-400 px-1">
              Click status pill to cycle task state live:
            </p>

            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No tasks assigned to you yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const meta = statusMap[task.status] || {
                    label: task.status,
                    style: "bg-slate-700 text-white",
                  };
                  const isUpdating = updatingTaskId === task._id;

                  return (
                    <div
                      key={task._id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-white line-clamp-2">
                          {task.title}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {task.projectName || "Project Workspace"}
                        </span>

                        <button
                          onClick={() => cycleTaskStatus(task)}
                          disabled={isUpdating}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                            meta.style
                          } transition-transform active:scale-95 shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1`}
                        >
                          {isUpdating && <Loader2 className="w-3 h-3 animate-spin" />}
                          <span>{meta.label}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}