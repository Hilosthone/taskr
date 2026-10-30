"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Task, TaskStatus, ProjectMember } from "@/lib/api";

const statusColumns: { id: TaskStatus; label: string; bg: string }[] = [
  { id: "todo", label: "To Do", bg: "bg-slate-700/80" },
  { id: "in-progress", label: "Working on it", bg: "bg-[var(--color-taskr-working)]" },
  { id: "review", label: "In Review", bg: "bg-amber-500" },
  { id: "completed", label: "Done", bg: "bg-[var(--color-taskr-done)]" },
  { id: "on-hold", label: "Stuck / On Hold", bg: "bg-[var(--color-taskr-stuck)]" },
];

interface KanbanBoardProps {
  tasks: Task[];
  members: ProjectMember[];
  onAssignTask: (taskId: string, memberId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function KanbanBoard({
  tasks,
  members,
  onAssignTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {statusColumns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div key={col.id} className="glass-panel p-3.5 flex flex-col gap-3 min-w-[240px] min-h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${col.bg}`} />
                <h3 className="text-xs font-bold text-white">{col.label}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                {colTasks.length}
              </span>
            </div>

            <div className="flex-1 space-y-3 pt-1">
              <AnimatePresence>
                {colTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-3.5 rounded-xl glass-card flex flex-col justify-between gap-3 group relative"
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-white">{task.title}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task._id)}
                            className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                      <select
                        value={task.assignedTo || "unassign"}
                        onChange={(e) => onAssignTask(task._id, e.target.value)}
                        className="bg-[var(--color-taskr-surface)] text-slate-300 text-[10px] py-0.5 px-1 rounded border border-white/10 cursor-pointer"
                      >
                        <option value="unassign">Unassigned</option>
                        {members.map((m) => (
                          <option key={m._id} value={m.userId}>
                            Role: {m.role}
                          </option>
                        ))}
                      </select>

                      <span className="capitalize px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                        {task.priority}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}