"use client";

import { Trash2 } from "lucide-react";
import { Task, ProjectMember } from "@/lib/api";

interface TableViewProps {
  tasks: Task[];
  members: ProjectMember[];
  onAssignTask: (taskId: string, memberId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TableView({ tasks, members, onAssignTask, onDeleteTask }: TableViewProps) {
  return (
    <div className="glass-panel p-6 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-xs font-semibold text-slate-400 uppercase">
            <th className="pb-3 pl-2">Task Title</th>
            <th className="pb-3">Assignee</th>
            <th className="pb-3">Priority</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-xs">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-500">
                No tasks found in this view.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id} className="hover:bg-white/[0.02]">
                <td className="py-4 pl-2 font-medium text-white">{task.title}</td>
                <td className="py-4">
                  <select
                    value={task.assignedTo || "unassign"}
                    onChange={(e) => onAssignTask(task._id, e.target.value)}
                    className="bg-[var(--color-taskr-surface)] text-slate-200 text-xs py-1 px-2 rounded border border-white/10 cursor-pointer"
                  >
                    <option value="unassign">Unassigned</option>
                    {members.map((m) => (
                      <option key={m._id} value={m.userId}>
                        {m.role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 text-slate-300 capitalize">{task.priority}</td>
                <td className="py-4 text-right pr-2">
                  <button
                    onClick={() => onDeleteTask(task._id)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}