
// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { LayoutGrid, List, Filter, AlertCircle, Loader2 } from "lucide-react";
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
//   ProjectStatus,
//   Invitation,
// } from "@/lib/api";

// import ProjectHeader from "@/components/projects/ProjectHeader";
// import KanbanBoard from "@/components/projects/KanbanBoard";
// import TableView from "@/components/projects/TableView";
// import TaskModal from "@/components/projects/TaskModal";
// import ProjectSettingsModal from "@/components/projects/ProjectSettingsModal";
// import InviteTeamModal from "@/components/projects/InviteTeamModal";

// export default function ProjectDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const projectId = params?.id as string;

//   const [project, setProject] = useState<Project | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [members, setMembers] = useState<ProjectMember[]>([]);
//   const [invitations, setInvitations] = useState<Invitation[]>([]);

//   const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
//   const [selectedMemberFilter, setSelectedMemberFilter] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Modals
//   const [settingsModalOpen, setSettingsModalOpen] = useState(false);
//   const [inviteModalOpen, setInviteModalOpen] = useState(false);
//   const [taskModalOpen, setTaskModalOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);

//   // Form states
//   const [editTitle, setEditTitle] = useState("");
//   const [editDesc, setEditDesc] = useState("");
//   const [editDueDate, setEditDueDate] = useState("");
//   const [savingProject, setSavingProject] = useState(false);

//   const [inviteEmail, setInviteEmail] = useState("");
//   const [inviteRole, setInviteRole] = useState<ProjectRole>("Member");
//   const [inviteSending, setInviteSending] = useState(false);

//   const [taskTitle, setTaskTitle] = useState("");
//   const [taskDesc, setTaskDesc] = useState("");
//   const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
//   const [taskDueDate, setTaskDueDate] = useState(
//     new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
//   );
//   const [taskSaving, setTaskSaving] = useState(false);

//   const fetchProjectData = async (memberFilterId?: string | null) => {
//     if (!projectId) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const [projRes, membersRes, invitesRes] = await Promise.all([
//         projectApi.getById(projectId).catch(() => null),
//         memberApi.getAll(projectId).catch(() => ({ data: { member: [] } })),
//         invitationApi.getAllInProject(projectId).catch(() => ({ data: { invitation: [] } })),
//       ]);

//       if (projRes?.data) {
//         setProject(projRes.data);
//         setEditTitle(projRes.data.title);
//         setEditDesc(projRes.data.description || "");
//         setEditDueDate(projRes.data.dueDate?.split("T")[0] || "");
//       }

//       setMembers(membersRes?.data?.member || []);
//       setInvitations(invitesRes?.data?.invitation || []);

//       if (memberFilterId) {
//         const memberTasksRes = await taskApi.getByMember(projectId, memberFilterId);
//         setTasks(memberTasksRes.data?.task || []);
//       } else {
//         const tasksRes = await taskApi.getProjectTasks(projectId);
//         setTasks(tasksRes.data?.task || []);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to load project details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjectData(selectedMemberFilter);
//   }, [projectId, selectedMemberFilter]);

//   const handleUpdateProjectStatus = async (status: ProjectStatus) => {
//     try {
//       await projectApi.updateStatus(projectId, status);
//       setProject((prev) => (prev ? { ...prev, status } : null));
//     } catch {
//       setError("Failed to update status.");
//     }
//   };

//   const handleSaveProjectSettings = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSavingProject(true);
//     try {
//       await projectApi.update(projectId, { title: editTitle, description: editDesc, dueDate: editDueDate });
//       setSettingsModalOpen(false);
//       fetchProjectData(selectedMemberFilter);
//     } catch (err: any) {
//       setError(err.message || "Failed to update settings.");
//     } finally {
//       setSavingProject(false);
//     }
//   };

//   const handleDeleteProject = async () => {
//     if (!confirm("Delete project?")) return;
//     try {
//       await projectApi.delete(projectId);
//       router.push("/projects");
//     } catch {
//       setError("Failed to delete project.");
//     }
//   };

//   const handleLeaveProject = async () => {
//     if (!confirm("Leave project?")) return;
//     try {
//       await memberApi.leaveProject(projectId);
//       router.push("/projects");
//     } catch {
//       setError("Failed to leave project.");
//     }
//   };

//   const handleSaveTask = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setTaskSaving(true);
//     try {
//       if (editingTask) {
//         await taskApi.update(projectId, editingTask._id, {
//           title: taskTitle,
//           description: taskDesc,
//           priority: taskPriority,
//           dueDate: taskDueDate,
//         });
//       } else {
//         await taskApi.create(projectId, {
//           title: taskTitle,
//           description: taskDesc,
//           priority: taskPriority,
//           dueDate: taskDueDate,
//         });
//       }
//       setTaskModalOpen(false);
//       fetchProjectData(selectedMemberFilter);
//     } catch (err: any) {
//       setError(err.message || "Failed to save task.");
//     } finally {
//       setTaskSaving(false);
//     }
//   };

//   const handleDeleteTask = async (taskId: string) => {
//     if (!confirm("Delete task?")) return;
//     try {
//       await taskApi.delete(projectId, taskId);
//       setTasks((prev) => prev.filter((t) => t._id !== taskId));
//     } catch {
//       setError("Failed to delete task.");
//     }
//   };

//   const handleAssignTask = async (taskId: string, memberId: string) => {
//     try {
//       if (memberId === "unassign") {
//         await taskApi.unassign(projectId, taskId);
//         setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, assignedTo: undefined } : t)));
//       } else {
//         await taskApi.assign(projectId, taskId, memberId);
//         setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, assignedTo: memberId } : t)));
//       }
//     } catch {
//       setError("Failed to update assignment.");
//     }
//   };

//   const handleSendInvite = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setInviteSending(true);
//     try {
//       await invitationApi.create(projectId, { inviteeEmail: inviteEmail, role: inviteRole });
//       setInviteEmail("");
//       setInviteModalOpen(false);
//       fetchProjectData(selectedMemberFilter);
//     } catch (err: any) {
//       setError(err.message || "Failed to send invitation.");
//     } finally {
//       setInviteSending(false);
//     }
//   };

//   const handleResendInvite = async (invitationId: string) => {
//     try {
//       await invitationApi.resend(projectId, invitationId);
//       alert("Invitation resent!");
//     } catch {
//       setError("Failed to resend invitation.");
//     }
//   };

//   const handleRevokeInvite = async (invitationId: string) => {
//     try {
//       await invitationApi.revoke(projectId, invitationId);
//       setInvitations((prev) => prev.filter((i) => i._id !== invitationId));
//     } catch {
//       setError("Failed to revoke invitation.");
//     }
//   };

//   const handleRemoveMember = async (memberId: string) => {
//     if (!confirm("Remove member?")) return;
//     try {
//       await memberApi.remove(projectId, memberId);
//       setMembers((prev) => prev.filter((m) => m._id !== memberId));
//     } catch {
//       setError("Failed to remove member.");
//     }
//   };

//   if (loading && !project) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//         <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
//         <p className="text-xs text-slate-400">Loading workspace...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 max-w-7xl mx-auto">
//       {/* Header Component */}
//       <ProjectHeader
//         project={project}
//         invitationsCount={invitations.length}
//         onUpdateStatus={handleUpdateProjectStatus}
//         onOpenSettings={() => setSettingsModalOpen(true)}
//         onOpenInvite={() => setInviteModalOpen(true)}
//         onOpenAddTask={() => {
//           setEditingTask(null);
//           setTaskTitle("");
//           setTaskDesc("");
//           setTaskModalOpen(true);
//         }}
//       />

//       {error && (
//         <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
//           <AlertCircle className="w-4 h-4 shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* View & Filter Controls */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
//         <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
//           <button
//             onClick={() => setViewMode("kanban")}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
//               viewMode === "kanban" ? "bg-[var(--color-taskr-blue)] text-white" : "text-slate-400"
//             }`}
//           >
//             <LayoutGrid className="w-3.5 h-3.5" />
//             <span>Kanban</span>
//           </button>
//           <button
//             onClick={() => setViewMode("list")}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
//               viewMode === "list" ? "bg-[var(--color-taskr-blue)] text-white" : "text-slate-400"
//             }`}
//           >
//             <List className="w-3.5 h-3.5" />
//             <span>Table</span>
//           </button>
//         </div>

//         <div className="flex items-center gap-2">
//           <Filter className="w-3.5 h-3.5 text-slate-400" />
//           <span className="text-xs text-slate-400">Filter Assignee:</span>
//           <select
//             value={selectedMemberFilter || "all"}
//             onChange={(e) => setSelectedMemberFilter(e.target.value === "all" ? null : e.target.value)}
//             className="glass-input text-xs py-1 px-2.5 bg-[var(--color-taskr-surface)] text-slate-200"
//           >
//             <option value="all">All Tasks</option>
//             {members.map((m) => (
//               <option key={m._id} value={m.userId}>
//                 Member ({m.role})
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Main Task Views */}
//       {viewMode === "kanban" ? (
//         <KanbanBoard
//           tasks={tasks}
//           members={members}
//           onAssignTask={handleAssignTask}
//           onEditTask={(t) => {
//             setEditingTask(t);
//             setTaskTitle(t.title);
//             setTaskDesc(t.description || "");
//             setTaskPriority(t.priority as any);
//             setTaskModalOpen(true);
//           }}
//           onDeleteTask={handleDeleteTask}
//         />
//       ) : (
//         <TableView
//           tasks={tasks}
//           members={members}
//           onAssignTask={handleAssignTask}
//           onDeleteTask={handleDeleteTask}
//         />
//       )}

//       {/* Modals */}
//       <ProjectSettingsModal
//         isOpen={settingsModalOpen}
//         editTitle={editTitle}
//         setEditTitle={setEditTitle}
//         editDesc={editDesc}
//         setEditDesc={setEditDesc}
//         editDueDate={editDueDate}
//         setEditDueDate={setEditDueDate}
//         saving={savingProject}
//         onClose={() => setSettingsModalOpen(false)}
//         onSave={handleSaveProjectSettings}
//         onLeave={handleLeaveProject}
//         onDelete={handleDeleteProject}
//       />

//       <InviteTeamModal
//         isOpen={inviteModalOpen}
//         inviteEmail={inviteEmail}
//         setInviteEmail={setInviteEmail}
//         inviteRole={inviteRole}
//         setInviteRole={setInviteRole}
//         inviteSending={inviteSending}
//         invitations={invitations}
//         members={members}
//         onClose={() => setInviteModalOpen(false)}
//         onSendInvite={handleSendInvite}
//         onResendInvite={handleResendInvite}
//         onRevokeInvite={handleRevokeInvite}
//         onRemoveMember={handleRemoveMember}
//       />

//       <TaskModal
//         isOpen={taskModalOpen}
//         editingTask={editingTask}
//         taskTitle={taskTitle}
//         setTaskTitle={setTaskTitle}
//         taskDesc={taskDesc}
//         setTaskDesc={setTaskDesc}
//         taskPriority={taskPriority}
//         setTaskPriority={setTaskPriority}
//         taskDueDate={taskDueDate}
//         setTaskDueDate={setTaskDueDate}
//         saving={taskSaving}
//         onClose={() => setTaskModalOpen(false)}
//         onSave={handleSaveTask}
//       />
//     </div>
//   );
// }





// export const dynamic = "force-dynamic";

import ProjectDetailClient from "./ProjectDetailClient";

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}