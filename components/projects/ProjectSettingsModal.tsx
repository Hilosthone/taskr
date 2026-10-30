"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, LogOut, Trash2 } from "lucide-react";

interface ProjectSettingsModalProps {
  isOpen: boolean;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editDesc: string;
  setEditDesc: (val: string) => void;
  editDueDate: string;
  setEditDueDate: (val: string) => void;
  saving: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onLeave: () => void;
  onDelete: () => void;
}

export default function ProjectSettingsModal({
  isOpen,
  editTitle,
  setEditTitle,
  editDesc,
  setEditDesc,
  editDueDate,
  setEditDueDate,
  saving,
  onClose,
  onSave,
  onLeave,
  onDelete,
}: ProjectSettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel w-full max-w-lg p-6 space-y-6 border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--color-taskr-blue)]" />
                <span>Project Settings</span>
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="glass-input w-full text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Due Date</label>
                <input
                  type="date"
                  required
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onLeave}
                    className="px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Leave Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={onDelete}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="glass-button-primary text-xs px-4 py-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}