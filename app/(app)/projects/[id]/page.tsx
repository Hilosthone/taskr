// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FolderKanban,
//   Plus,
//   Users,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   UserPlus,
//   X,
//   Send,
//   MoreHorizontal,
//   LayoutGrid,
//   List,
//   Loader2,
//   Calendar,
//   Trash2,
//   UserCheck,
//   Sparkles,
// } from "lucide-react";
// import {
//   projectApi,
//   taskApi,
//   memberApi,
//   invitationApi,
//   Project,
//   Task,
//   TaskStatus,
//   ProjectMember,
//   ProjectRole,
// } from "@/lib/api";

// const statusColumns: { id: TaskStatus; label: string; bg: string }[] = [
//   { id: "todo", label: "To Do", bg: "bg-slate-700/80" },
//   { id: "in-progress", label: "Working on it", bg: "bg-[var(--color-taskr-working)]" },
//   { id: "review", label: "In Review", bg: "bg-amber-500" },
//   { id: "completed", label: "Done", bg: "bg-[var(--color-taskr-done)]" },
//   { id: "on-hold", label: "Stuck / On Hold", bg: "bg-[var(--color-taskr-stuck)]" },
// ];

// export default function ProjectDetailPage() {
//   const params = useParams();
//   const projectId = params?.id as string;

//   const [project, setProject] = useState<Project | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [members, setMembers] = useState<ProjectMember[]>([]);
//   const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Invite Modal State
//   const [inviteModalOpen, setInviteModalOpen] = useState(false);
//   const [inviteEmail, setInviteEmail] = useState("");
//   const [inviteRole, setInviteRole] = useState<ProjectRole>("Member");
//   const [inviteSending, setInviteSending] = useState(false);
//   const [inviteSuccess, setInviteSuccess] = useState(false);
//   const [inviteError, setInviteError] = useState<string | null>(null);

//   // Task Modal State
//   const [taskModalOpen, setTaskModalOpen] = useState(false);
//   const [newTaskTitle, setNewTaskTitle] = useState("");
//   const [newTaskDesc, setNewTaskDesc] = useState("");
//   const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
//   const [newTaskDueDate, setNewTaskDueDate] = useState(
//     new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
//   );
//   const [taskCreating, setTaskCreating] = useState(false);
//   const [taskError, setTaskError] = useState<string | null>(null);

//   // Fetch Project, Tasks, and Members
//   const fetchProjectData = async () => {
//     if (!projectId) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const [projRes, tasksRes, membersRes] = await Promise.all([
//         projectApi.getById(projectId).catch(() => null),
//         taskApi.getProjectTasks(projectId).catch(() => ({ data: { task: [] } })),
//         memberApi.getAll(projectId).catch(() => ({ data: { member: [] } })),
//       ]);

//       if (projRes?.data) {
//         setProject(projRes.data);
//       }
//       setTasks(tasksRes?.data?.task || []);
//       setMembers(membersRes?.data?.member || []);
//     } catch (err: any) {
//       console.error("Failed to load project details:", err);
//       setError(err.message || "Failed to load project details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjectData();
//   }, [projectId]);

//   // Update task status (PATCH /api/v1/project/{id}/task/{taskId}/status)
//   const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
//     try {
//       await taskApi.updateStatus(projectId, taskId, newStatus);
//       setTasks((prev) =>
//         prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
//       );
//     } catch (err) {
//       console.error("Failed to update task status:", err);
//     }
//   };

//   // Create Task (POST /api/v1/project/{id}/task)
//   const handleCreateTask = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newTaskTitle.trim()) return;

//     setTaskCreating(true);
//     setTaskError(null);

//     try {
//       await taskApi.create(projectId, {
//         title: newTaskTitle.trim(),
//         description: newTaskDesc.trim() || "No task description provided.",
//         priority: newTaskPriority,
//         dueDate: newTaskDueDate,
//       });

//       setNewTaskTitle("");
//       setNewTaskDesc("");
//       setTaskModalOpen(false);
//       fetchProjectData();
//     } catch (err: any) {
//       console.error("Task creation failed:", err);
//       setTaskError(err.message || err.response?.data?.message || "Failed to create task.");
//     } finally {
//       setTaskCreating(false);
//     }
//   };

//   // Create Invitation (POST /api/v1/project/{id}/invitation)
//   const handleSendInvite = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inviteEmail.trim()) return;

//     setInviteSending(true);
//     setInviteError(null);

//     try {
//       await invitationApi.create(projectId, {
//         inviteeEmail: inviteEmail.trim(),
//         role: inviteRole,
//       });

//       setInviteSuccess(true);
//       setTimeout(() => {
//         setInviteSuccess(false);
//         setInviteEmail("");
//         setInviteModalOpen(false);
//       }, 1500);
//     } catch (err: any) {
//       console.error("Invitation failed:", err);
//       setInviteError(
//         err.message || err.response?.data?.message || "Failed to dispatch invitation link."
//       );
//     } finally {
//       setInviteSending(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//         <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
//         <p className="text-xs text-slate-400">Loading project workspace...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 max-w-7xl mx-auto">
//       {/* Project Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 border-white/15">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-taskr-blue)]/20 text-[var(--color-taskr-blue)] border border-[var(--color-taskr-blue)]/30 capitalize">
//               {project?.status.replace("_", " ") || "Active Workspace"}
//             </span>
//           </div>
//           <h1 className="text-2xl font-bold text-white tracking-tight">
//             {project?.title || "Project Workspace"}
//           </h1>
//           <p className="text-xs text-slate-300">
//             {project?.description || "Collaborative task management board and permissions."}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => {
//               setInviteError(null);
//               setInviteSuccess(false);
//               setInviteModalOpen(true);
//             }}
//             className="glass-card px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer"
//           >
//             <UserPlus className="w-4 h-4 text-[var(--color-taskr-purple)]" />
//             <span>Invite Team</span>
//           </button>

//           <button
//             onClick={() => {
//               setTaskError(null);
//               setTaskModalOpen(true);
//             }}
//             className="glass-button-primary text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Add Task</span>
//           </button>
//         </div>
//       </div>

//       {/* Global Error Banner */}
//       {error && (
//         <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
//           <AlertCircle className="w-4 h-4 shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* View Mode Toggle & Members Bar */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
//         <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
//           <button
//             onClick={() => setViewMode("kanban")}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
//               viewMode === "kanban"
//                 ? "bg-[var(--color-taskr-blue)] text-white shadow-md"
//                 : "text-slate-400 hover:text-white"
//             }`}
//           >
//             <LayoutGrid className="w-3.5 h-3.5" />
//             <span>Kanban Board</span>
//           </button>
//           <button
//             onClick={() => setViewMode("list")}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
//               viewMode === "list"
//                 ? "bg-[var(--color-taskr-blue)] text-white shadow-md"
//                 : "text-slate-400 hover:text-white"
//             }`}
//           >
//             <List className="w-3.5 h-3.5" />
//             <span>Table List</span>
//           </button>
//         </div>

//         {/* Member Avatars */}
//         <div className="flex items-center gap-2">
//           <span className="text-xs text-slate-400 mr-1">Project Members:</span>
//           <div className="flex -space-x-2">
//             {members.length === 0 ? (
//               <span className="text-xs text-slate-500">1 (Owner)</span>
//             ) : (
//               members.map((m) => (
//                 <div
//                   key={m._id}
//                   title={`Member Role: ${m.role}`}
//                   className="w-8 h-8 rounded-full bg-[var(--color-taskr-blue)] border-2 border-[var(--color-taskr-dark)] flex items-center justify-center text-xs font-bold text-white shadow-sm"
//                 >
//                   {m.role.charAt(0)}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* KANBAN BOARD VIEW */}
//       {viewMode === "kanban" ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
//           {statusColumns.map((col) => {
//             const colTasks = tasks.filter((t) => t.status === col.id);

//             return (
//               <div
//                 key={col.id}
//                 className="glass-panel p-3.5 flex flex-col gap-3 min-w-[240px] min-h-[420px]"
//               >
//                 <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1">
//                   <div className="flex items-center gap-2">
//                     <span className={`w-3 h-3 rounded-full ${col.bg}`} />
//                     <h3 className="text-xs font-bold text-white">{col.label}</h3>
//                   </div>
//                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
//                     {colTasks.length}
//                   </span>
//                 </div>

//                 <div className="flex-1 space-y-3 pt-1">
//                   <AnimatePresence>
//                     {colTasks.map((task) => (
//                       <motion.div
//                         key={task._id}
//                         layout
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         transition={{ duration: 0.2 }}
//                         className="p-3.5 rounded-xl glass-card flex flex-col justify-between gap-3 group"
//                       >
//                         <div className="space-y-1">
//                           <p className="text-xs font-medium text-white leading-relaxed">
//                             {task.title}
//                           </p>
//                           {task.description && (
//                             <p className="text-[11px] text-slate-400 line-clamp-2">
//                               {task.description}
//                             </p>
//                           )}
//                         </div>

//                         <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
//                           <span className="capitalize px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
//                             {task.priority || "Medium"}
//                           </span>

//                           <select
//                             value={task.status}
//                             onChange={(e) =>
//                               handleStatusChange(task._id, e.target.value as TaskStatus)
//                             }
//                             className="bg-[var(--color-taskr-surface)] text-slate-200 text-[10px] px-1.5 py-0.5 rounded border border-white/10 cursor-pointer"
//                           >
//                             <option value="todo">To Do</option>
//                             <option value="in-progress">Working on it</option>
//                             <option value="review">In Review</option>
//                             <option value="completed">Done</option>
//                             <option value="on-hold">Stuck</option>
//                           </select>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         /* TABLE LIST VIEW */
//         <div className="glass-panel p-6 overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                 <th className="pb-3 pl-2">Task Title</th>
//                 <th className="pb-3">Priority</th>
//                 <th className="pb-3">Due Date</th>
//                 <th className="pb-3 text-center">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5 text-xs">
//               {tasks.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="py-8 text-center text-slate-500">
//                     No tasks found in this project workspace.
//                   </td>
//                 </tr>
//               ) : (
//                 tasks.map((task) => (
//                   <tr key={task._id} className="hover:bg-white/[0.02]">
//                     <td className="py-4 pl-2 font-medium text-white">{task.title}</td>
//                     <td className="py-4 text-slate-300 capitalize">{task.priority || "Medium"}</td>
//                     <td className="py-4 text-slate-400">
//                       {new Date(task.dueDate).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 text-center">
//                       <select
//                         value={task.status}
//                         onChange={(e) =>
//                           handleStatusChange(task._id, e.target.value as TaskStatus)
//                         }
//                         className="bg-[var(--color-taskr-surface)] text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer"
//                       >
//                         <option value="todo">To Do</option>
//                         <option value="in-progress">Working on it</option>
//                         <option value="review">In Review</option>
//                         <option value="completed">Done</option>
//                         <option value="on-hold">Stuck</option>
//                       </select>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Send Team Invitation Modal */}
//       <AnimatePresence>
//         {inviteModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="glass-panel w-full max-w-md p-6 space-y-5 border-white/20 shadow-2xl"
//             >
//               <div className="flex items-center justify-between pb-3 border-b border-white/10">
//                 <h3 className="text-base font-bold text-white flex items-center gap-2">
//                   <UserPlus className="w-5 h-5 text-[var(--color-taskr-purple)]" />
//                   <span>Invite Collaborator</span>
//                 </h3>
//                 <button
//                   onClick={() => setInviteModalOpen(false)}
//                   className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {inviteError && (
//                 <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4 shrink-0" />
//                   <span>{inviteError}</span>
//                 </div>
//               )}

//               {inviteSuccess ? (
//                 <div className="p-4 rounded-xl bg-[var(--color-taskr-done)]/20 border border-[var(--color-taskr-done)]/30 text-center text-xs font-medium text-[var(--color-taskr-done)]">
//                   Invitation link created & dispatched successfully!
//                 </div>
//               ) : (
//                 <form onSubmit={handleSendInvite} className="space-y-4">
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-medium text-slate-300">
//                       Collaborator Email *
//                     </label>
//                     <input
//                       type="email"
//                       required
//                       disabled={inviteSending}
//                       value={inviteEmail}
//                       onChange={(e) => setInviteEmail(e.target.value)}
//                       placeholder="teammate@company.com"
//                       className="glass-input w-full text-xs disabled:opacity-50"
//                     />
//                   </div>

//                   <div className="space-y-1.5">
//                     <label className="text-xs font-medium text-slate-300">Project Role</label>
//                     <select
//                       value={inviteRole}
//                       onChange={(e) => setInviteRole(e.target.value as ProjectRole)}
//                       className="glass-input w-full text-xs bg-[var(--color-taskr-surface)] text-slate-200"
//                     >
//                       <option value="Project Manager">Project Manager</option>
//                       <option value="Member">Member</option>
//                       <option value="Viewer">Viewer</option>
//                     </select>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={inviteSending}
//                     className="glass-button-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
//                   >
//                     {inviteSending ? (
//                       <>
//                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                         <span>Sending Invitation...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-3.5 h-3.5" />
//                         <span>Send Invitation</span>
//                       </>
//                     )}
//                   </button>
//                 </form>
//               )}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Add Task Modal */}
//       <AnimatePresence>
//         {taskModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="glass-panel w-full max-w-md p-6 space-y-5 border-white/20 shadow-2xl"
//             >
//               <div className="flex items-center justify-between pb-3 border-b border-white/10">
//                 <h3 className="text-base font-bold text-white flex items-center gap-2">
//                   <Plus className="w-5 h-5 text-[var(--color-taskr-blue)]" />
//                   <span>Create New Task</span>
//                 </h3>
//                 <button
//                   onClick={() => setTaskModalOpen(false)}
//                   className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {taskError && (
//                 <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4 shrink-0" />
//                   <span>{taskError}</span>
//                 </div>
//               )}

//               <form onSubmit={handleCreateTask} className="space-y-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-medium text-slate-300">Task Title *</label>
//                   <input
//                     type="text"
//                     required
//                     disabled={taskCreating}
//                     value={newTaskTitle}
//                     onChange={(e) => setNewTaskTitle(e.target.value)}
//                     placeholder="e.g. Implement refresh token rotation"
//                     className="glass-input w-full text-xs disabled:opacity-50"
//                   />
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-xs font-medium text-slate-300">Description</label>
//                   <textarea
//                     rows={3}
//                     disabled={taskCreating}
//                     value={newTaskDesc}
//                     onChange={(e) => setNewTaskDesc(e.target.value)}
//                     placeholder="Add details or context for this task..."
//                     className="glass-input w-full text-xs resize-none disabled:opacity-50"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-medium text-slate-300">Priority</label>
//                     <select
//                       value={newTaskPriority}
//                       onChange={(e) =>
//                         setNewTaskPriority(e.target.value as "low" | "medium" | "high")
//                       }
//                       className="glass-input w-full text-xs bg-[var(--color-taskr-surface)] text-slate-200"
//                     >
//                       <option value="low">Low</option>
//                       <option value="medium">Medium</option>
//                       <option value="high">High</option>
//                     </select>
//                   </div>

//                   <div className="space-y-1.5">
//                     <label className="text-xs font-medium text-slate-300">Due Date *</label>
//                     <input
//                       type="date"
//                       required
//                       disabled={taskCreating}
//                       value={newTaskDueDate}
//                       onChange={(e) => setNewTaskDueDate(e.target.value)}
//                       className="glass-input w-full text-xs disabled:opacity-50"
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={taskCreating}
//                   className="glass-button-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
//                 >
//                   {taskCreating ? (
//                     <>
//                       <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                       <span>Creating Task...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="w-4 h-4" />
//                       <span>Add Task to Workspace</span>
//                     </>
//                   )}
//                 </button>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LayoutGrid, List, Filter, AlertCircle, Loader2 } from "lucide-react";
import {
  projectApi,
  taskApi,
  memberApi,
  invitationApi,
  Project,
  Task,
  TaskStatus,
  ProjectMember,
  ProjectRole,
  ProjectStatus,
  Invitation,
} from "@/lib/api";

import ProjectHeader from "@/components/projects/ProjectHeader";
import KanbanBoard from "@/components/projects/KanbanBoard";
import TableView from "@/components/projects/TableView";
import TaskModal from "@/components/projects/TaskModal";
import ProjectSettingsModal from "@/components/projects/ProjectSettingsModal";
import InviteTeamModal from "@/components/projects/InviteTeamModal";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [savingProject, setSavingProject] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<ProjectRole>("Member");
  const [inviteSending, setInviteSending] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [taskSaving, setTaskSaving] = useState(false);

  const fetchProjectData = async (memberFilterId?: string | null) => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    try {
      const [projRes, membersRes, invitesRes] = await Promise.all([
        projectApi.getById(projectId).catch(() => null),
        memberApi.getAll(projectId).catch(() => ({ data: { member: [] } })),
        invitationApi.getAllInProject(projectId).catch(() => ({ data: { invitation: [] } })),
      ]);

      if (projRes?.data) {
        setProject(projRes.data);
        setEditTitle(projRes.data.title);
        setEditDesc(projRes.data.description || "");
        setEditDueDate(projRes.data.dueDate?.split("T")[0] || "");
      }

      setMembers(membersRes?.data?.member || []);
      setInvitations(invitesRes?.data?.invitation || []);

      if (memberFilterId) {
        const memberTasksRes = await taskApi.getByMember(projectId, memberFilterId);
        setTasks(memberTasksRes.data?.task || []);
      } else {
        const tasksRes = await taskApi.getProjectTasks(projectId);
        setTasks(tasksRes.data?.task || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData(selectedMemberFilter);
  }, [projectId, selectedMemberFilter]);

  const handleUpdateProjectStatus = async (status: ProjectStatus) => {
    try {
      await projectApi.updateStatus(projectId, status);
      setProject((prev) => (prev ? { ...prev, status } : null));
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleSaveProjectSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    try {
      await projectApi.update(projectId, { title: editTitle, description: editDesc, dueDate: editDueDate });
      setSettingsModalOpen(false);
      fetchProjectData(selectedMemberFilter);
    } catch (err: any) {
      setError(err.message || "Failed to update settings.");
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Delete project?")) return;
    try {
      await projectApi.delete(projectId);
      router.push("/projects");
    } catch {
      setError("Failed to delete project.");
    }
  };

  const handleLeaveProject = async () => {
    if (!confirm("Leave project?")) return;
    try {
      await memberApi.leaveProject(projectId);
      router.push("/projects");
    } catch {
      setError("Failed to leave project.");
    }
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskSaving(true);
    try {
      if (editingTask) {
        await taskApi.update(projectId, editingTask._id, {
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          dueDate: taskDueDate,
        });
      } else {
        await taskApi.create(projectId, {
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          dueDate: taskDueDate,
        });
      }
      setTaskModalOpen(false);
      fetchProjectData(selectedMemberFilter);
    } catch (err: any) {
      setError(err.message || "Failed to save task.");
    } finally {
      setTaskSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete task?")) return;
    try {
      await taskApi.delete(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const handleAssignTask = async (taskId: string, memberId: string) => {
    try {
      if (memberId === "unassign") {
        await taskApi.unassign(projectId, taskId);
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, assignedTo: undefined } : t)));
      } else {
        await taskApi.assign(projectId, taskId, memberId);
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, assignedTo: memberId } : t)));
      }
    } catch {
      setError("Failed to update assignment.");
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSending(true);
    try {
      await invitationApi.create(projectId, { inviteeEmail: inviteEmail, role: inviteRole });
      setInviteEmail("");
      setInviteModalOpen(false);
      fetchProjectData(selectedMemberFilter);
    } catch (err: any) {
      setError(err.message || "Failed to send invitation.");
    } finally {
      setInviteSending(false);
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    try {
      await invitationApi.resend(projectId, invitationId);
      alert("Invitation resent!");
    } catch {
      setError("Failed to resend invitation.");
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    try {
      await invitationApi.revoke(projectId, invitationId);
      setInvitations((prev) => prev.filter((i) => i._id !== invitationId));
    } catch {
      setError("Failed to revoke invitation.");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove member?")) return;
    try {
      await memberApi.remove(projectId, memberId);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch {
      setError("Failed to remove member.");
    }
  };

  if (loading && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
        <p className="text-xs text-slate-400">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Component */}
      <ProjectHeader
        project={project}
        invitationsCount={invitations.length}
        onUpdateStatus={handleUpdateProjectStatus}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenInvite={() => setInviteModalOpen(true)}
        onOpenAddTask={() => {
          setEditingTask(null);
          setTaskTitle("");
          setTaskDesc("");
          setTaskModalOpen(true);
        }}
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* View & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              viewMode === "kanban" ? "bg-[var(--color-taskr-blue)] text-white" : "text-slate-400"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              viewMode === "list" ? "bg-[var(--color-taskr-blue)] text-white" : "text-slate-400"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Filter Assignee:</span>
          <select
            value={selectedMemberFilter || "all"}
            onChange={(e) => setSelectedMemberFilter(e.target.value === "all" ? null : e.target.value)}
            className="glass-input text-xs py-1 px-2.5 bg-[var(--color-taskr-surface)] text-slate-200"
          >
            <option value="all">All Tasks</option>
            {members.map((m) => (
              <option key={m._id} value={m.userId}>
                Member ({m.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Task Views */}
      {viewMode === "kanban" ? (
        <KanbanBoard
          tasks={tasks}
          members={members}
          onAssignTask={handleAssignTask}
          onEditTask={(t) => {
            setEditingTask(t);
            setTaskTitle(t.title);
            setTaskDesc(t.description || "");
            setTaskPriority(t.priority as any);
            setTaskModalOpen(true);
          }}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <TableView
          tasks={tasks}
          members={members}
          onAssignTask={handleAssignTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Modals */}
      <ProjectSettingsModal
        isOpen={settingsModalOpen}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDesc={editDesc}
        setEditDesc={setEditDesc}
        editDueDate={editDueDate}
        setEditDueDate={setEditDueDate}
        saving={savingProject}
        onClose={() => setSettingsModalOpen(false)}
        onSave={handleSaveProjectSettings}
        onLeave={handleLeaveProject}
        onDelete={handleDeleteProject}
      />

      <InviteTeamModal
        isOpen={inviteModalOpen}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        inviteSending={inviteSending}
        invitations={invitations}
        members={members}
        onClose={() => setInviteModalOpen(false)}
        onSendInvite={handleSendInvite}
        onResendInvite={handleResendInvite}
        onRevokeInvite={handleRevokeInvite}
        onRemoveMember={handleRemoveMember}
      />

      <TaskModal
        isOpen={taskModalOpen}
        editingTask={editingTask}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDesc={taskDesc}
        setTaskDesc={setTaskDesc}
        taskPriority={taskPriority}
        setTaskPriority={setTaskPriority}
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        saving={taskSaving}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}