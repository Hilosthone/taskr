"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Task } from "@/lib/api";

interface TaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  taskTitle: string;
  setTaskTitle: (val: string) => void;
  taskDesc: string;
  setTaskDesc: (val: string) => void;
  taskPriority: "low" | "medium" | "high";
  setTaskPriority: (val: "low" | "medium" | "high") => void;
  taskDueDate: string;
  setTaskDueDate: (val: string) => void;
  saving: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export default function TaskModal({
  isOpen,
  editingTask,
  taskTitle,
  setTaskTitle,
  taskDesc,
  setTaskDesc,
  taskPriority,
  setTaskPriority,
  taskDueDate,
  setTaskDueDate,
  saving,
  onClose,
  onSave,
}: TaskModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel w-full max-w-md p-6 space-y-4 border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingTask ? "Edit Task Details" : "Create New Task"}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSave} className="space-y-3">
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="glass-input w-full text-xs"
              />

              <textarea
                rows={3}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Task description..."
                className="glass-input w-full text-xs resize-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="glass-input text-xs bg-[var(--color-taskr-surface)] text-slate-200"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="glass-button-primary w-full py-2 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : editingTask ? (
                  "Update Task"
                ) : (
                  "Add Task"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}