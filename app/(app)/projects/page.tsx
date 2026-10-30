// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FolderKanban,
//   Plus,
//   Search,
//   Users,
//   X,
//   Sparkles,
//   ArrowRight,
//   Loader2,
//   AlertCircle,
//   Calendar,
//   CheckCircle2,
// } from "lucide-react";
// import {
//   projectApi,
//   taskApi,
//   memberApi,
//   Project,
//   ProjectStatus,
//   ProjectTypeFilter,
// } from "@/lib/api";

// interface ProjectStats {
//   membersCount: number;
//   tasksCount: number;
//   completedTasks: number;
// }

// export default function ProjectsPage() {
//   const searchParams = useSearchParams();
//   const initialTitleQuery = searchParams.get("title") || "";

//   const [projects, setProjects] = useState<Project[]>([]);
//   const [projectStatsMap, setProjectStatsMap] = useState<Record<string, ProjectStats>>({});
//   const [searchQuery, setSearchQuery] = useState(initialTitleQuery);
//   const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
//   const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter | "all">("all");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // New Project Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newDueDate, setNewDueDate] = useState(
//     new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
//   );
//   const [creating, setCreating] = useState(false);
//   const [createError, setCreateError] = useState<string | null>(null);

//   // Fetch Projects from live API
//   const fetchProjects = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const queryParams: any = {};
//       if (statusFilter !== "all") queryParams.status = statusFilter;
//       if (typeFilter !== "all") queryParams.type = typeFilter;
//       if (searchQuery.trim()) queryParams.title = searchQuery.trim();

//       const response = await projectApi.getAll(queryParams);
//       const projectList = response.data?.project || [];
//       setProjects(projectList);

//       // Fetch supplementary stats (tasks and members count) for each project concurrently
//       if (projectList.length > 0) {
//         const statsPromises = projectList.map(async (project) => {
//           try {
//             const [tasksRes, membersRes] = await Promise.all([
//               taskApi.getProjectTasks(project._id).catch(() => ({ data: { task: [] } })),
//               memberApi.getAll(project._id).catch(() => ({ data: { member: [] } })),
//             ]);

//             const taskList = tasksRes.data?.task || [];
//             const memberList = membersRes.data?.member || [];

//             const completed = taskList.filter((t) => t.status === "completed").length;

//             return {
//               id: project._id,
//               stats: {
//                 membersCount: memberList.length || 1,
//                 tasksCount: taskList.length,
//                 completedTasks: completed,
//               },
//             };
//           } catch {
//             return {
//               id: project._id,
//               stats: { membersCount: 1, tasksCount: 0, completedTasks: 0 },
//             };
//           }
//         });

//         const statsResults = await Promise.all(statsPromises);
//         const newStatsMap: Record<string, ProjectStats> = {};
//         statsResults.forEach((item) => {
//           newStatsMap[item.id] = item.stats;
//         });
//         setProjectStatsMap(newStatsMap);
//       }
//     } catch (err: any) {
//       console.error("Failed to fetch projects:", err);
//       setError(
//         err.message ||
//           err.response?.data?.message ||
//           "Failed to load projects. Please check your network connection."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, [statusFilter, typeFilter]);

//   // Handle Search Input Submission
//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchProjects();
//   };

//   // Create Project Submission (POST /api/v1/project)
//   const handleCreateProject = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newTitle.trim()) return;

//     setCreating(true);
//     setCreateError(null);

//     try {
//       await projectApi.create({
//         title: newTitle.trim(),
//         description: newDescription.trim() || "No description provided.",
//         dueDate: newDueDate,
//       });

//       setNewTitle("");
//       setNewDescription("");
//       setIsModalOpen(false);
//       fetchProjects(); // Refresh list
//     } catch (err: any) {
//       console.error("Failed to create project:", err);
//       setCreateError(
//         err.message || err.response?.data?.message || "Failed to create project workspace."
//       );
//     } finally {
//       setCreating(false);
//     }
//   };

//   return (
//     <div className="space-y-8 max-w-7xl mx-auto">
//       {/* Header Bar */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
//             <FolderKanban className="w-7 h-7 text-[var(--color-taskr-blue)]" />
//             <span>Project Workspaces</span>
//           </h1>
//           <p className="text-sm text-slate-400 mt-1">
//             Manage your collaborative project workspaces, tasks, and team permissions.
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setCreateError(null);
//             setIsModalOpen(true);
//           }}
//           className="glass-button-primary text-sm px-5 py-2.5 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
//         >
//           <Plus className="w-4 h-4" />
//           <span>New Project</span>
//         </button>
//       </div>

//       {/* Filter & Search Controls */}
//       <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
//         <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
//           <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search project titles..."
//             className="glass-input w-full pl-10 py-2 text-xs"
//           />
//         </form>

//         {/* Status & Type Filter Pills */}
//         <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value as any)}
//             className="glass-input text-xs py-1.5 px-3 bg-[var(--color-taskr-surface)] text-slate-200"
//           >
//             <option value="all">All Statuses</option>
//             <option value="active">Active</option>
//             <option value="planning">Planning</option>
//             <option value="on_hold">On Hold</option>
//             <option value="completed">Completed</option>
//           </select>

//           <select
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value as any)}
//             className="glass-input text-xs py-1.5 px-3 bg-[var(--color-taskr-surface)] text-slate-200"
//           >
//             <option value="all">All Access</option>
//             <option value="mine">Created By Me</option>
//             <option value="member">Shared Member</option>
//           </select>

//           <div className="text-xs text-slate-400 ml-auto md:ml-2">
//             Total: <span className="text-white font-medium">{projects.length}</span>
//           </div>
//         </div>
//       </div>

//       {/* Global Error Banner */}
//       {error && (
//         <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
//           <AlertCircle className="w-4 h-4 shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Loading Grid Indicator */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
//           <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
//           <p className="text-xs text-slate-400">Loading project workspaces...</p>
//         </div>
//       ) : projects.length === 0 ? (
//         <div className="glass-panel p-12 text-center space-y-4">
//           <FolderKanban className="w-10 h-10 text-slate-500 mx-auto" />
//           <div className="space-y-1">
//             <h3 className="text-base font-bold text-white">No Projects Found</h3>
//             <p className="text-xs text-slate-400">
//               There are no projects matching your current filter criteria.
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               setCreateError(null);
//               setIsModalOpen(true);
//             }}
//             className="glass-button-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Create New Project</span>
//           </button>
//         </div>
//       ) : (
//         /* Project Grid */
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {projects.map((project, idx) => {
//             const stats = projectStatsMap[project._id] || {
//               membersCount: 1,
//               tasksCount: 0,
//               completedTasks: 0,
//             };

//             const progressPct =
//               stats.tasksCount > 0
//                 ? Math.round((stats.completedTasks / stats.tasksCount) * 100)
//                 : 0;

//             return (
//               <motion.div
//                 key={project._id}
//                 initial={{ opacity: 0, y: 15 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: idx * 0.05 }}
//               >
//                 <Link
//                   href={`/projects/${project._id}`}
//                   className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-5 h-full block group relative overflow-hidden cursor-pointer"
//                 >
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between gap-2">
//                       <h2 className="text-lg font-bold text-white group-hover:text-[var(--color-taskr-blue)] transition-colors line-clamp-1">
//                         {project.title}
//                       </h2>
//                       <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--color-taskr-done)]/20 text-[var(--color-taskr-done)] border border-[var(--color-taskr-done)]/30 capitalize shrink-0">
//                         {project.status.replace("_", " ")}
//                       </span>
//                     </div>
//                     <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
//                       {project.description || "No description provided."}
//                     </p>
//                   </div>

//                   <div className="space-y-3 pt-2">
//                     <div className="space-y-1">
//                       <div className="flex justify-between text-[11px] text-slate-400">
//                         <span>Completion Rate</span>
//                         <span>{progressPct}%</span>
//                       </div>
//                       <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
//                         <div
//                           className="h-full bg-gradient-to-r from-[var(--color-taskr-blue)] to-[var(--color-taskr-done)] rounded-full transition-all duration-500"
//                           style={{ width: `${progressPct}%` }}
//                         />
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
//                       <div className="flex items-center gap-1.5">
//                         <Users className="w-3.5 h-3.5 text-slate-400" />
//                         <span>{stats.membersCount} Members</span>
//                       </div>
//                       <span>
//                         {stats.completedTasks} / {stats.tasksCount} Tasks
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/* Create Project Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 10 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 10 }}
//               className="glass-panel w-full max-w-lg p-6 sm:p-8 space-y-6 relative border-white/20 shadow-2xl"
//             >
//               <div className="flex items-center justify-between pb-4 border-b border-white/10">
//                 <div className="flex items-center gap-2">
//                   <Sparkles className="w-5 h-5 text-[var(--color-taskr-blue)]" />
//                   <h3 className="text-lg font-bold text-white">Create New Project</h3>
//                 </div>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {createError && (
//                 <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4 shrink-0" />
//                   <span>{createError}</span>
//                 </div>
//               )}

//               <form onSubmit={handleCreateProject} className="space-y-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-medium text-slate-300">
//                     Project Title *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     disabled={creating}
//                     value={newTitle}
//                     onChange={(e) => setNewTitle(e.target.value)}
//                     placeholder="e.g., Mobile App Redesign"
//                     className="glass-input w-full text-sm disabled:opacity-50"
//                   />
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-xs font-medium text-slate-300">
//                     Description
//                   </label>
//                   <textarea
//                     rows={3}
//                     disabled={creating}
//                     value={newDescription}
//                     onChange={(e) => setNewDescription(e.target.value)}
//                     placeholder="Brief summary of the project scope and goals..."
//                     className="glass-input w-full text-sm resize-none disabled:opacity-50"
//                   />
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="text-xs font-medium text-slate-300">
//                     Target Due Date *
//                   </label>
//                   <div className="relative">
//                     <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input
//                       type="date"
//                       required
//                       disabled={creating}
//                       value={newDueDate}
//                       onChange={(e) => setNewDueDate(e.target.value)}
//                       className="glass-input w-full pl-10 text-xs disabled:opacity-50"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     disabled={creating}
//                     className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={creating}
//                     className="glass-button-primary text-xs px-5 py-2.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
//                   >
//                     {creating ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         <span>Creating...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>Create Workspace</span>
//                         <ArrowRight className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FolderKanban, Plus, Loader2, AlertCircle } from "lucide-react";
import {
  projectApi,
  taskApi,
  memberApi,
  Project,
  ProjectStatus,
  ProjectTypeFilter,
} from "@/lib/api";

import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsFilterBar from "@/components/projects/ProjectsFilterBar";
import ProjectCard, { ProjectStats } from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialTitleQuery = searchParams.get("title") || "";

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStatsMap, setProjectStatsMap] = useState<Record<string, ProjectStats>>({});
  const [searchQuery, setSearchQuery] = useState(initialTitleQuery);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter | "all">("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams: any = {};
      if (statusFilter !== "all") queryParams.status = statusFilter;
      if (typeFilter !== "all") queryParams.type = typeFilter;
      if (searchQuery.trim()) queryParams.title = searchQuery.trim();

      const response = await projectApi.getAll(queryParams);
      const projectList = response.data?.project || [];
      setProjects(projectList);

      if (projectList.length > 0) {
        const statsPromises = projectList.map(async (project) => {
          try {
            const [tasksRes, membersRes] = await Promise.all([
              taskApi.getProjectTasks(project._id).catch(() => ({ data: { task: [] } })),
              memberApi.getAll(project._id).catch(() => ({ data: { member: [] } })),
            ]);

            const taskList = tasksRes.data?.task || [];
            const memberList = membersRes.data?.member || [];
            const completed = taskList.filter((t) => t.status === "completed").length;

            return {
              id: project._id,
              stats: {
                membersCount: memberList.length || 1,
                tasksCount: taskList.length,
                completedTasks: completed,
              },
            };
          } catch {
            return {
              id: project._id,
              stats: { membersCount: 1, tasksCount: 0, completedTasks: 0 },
            };
          }
        });

        const statsResults = await Promise.all(statsPromises);
        const newStatsMap: Record<string, ProjectStats> = {};
        statsResults.forEach((item) => {
          newStatsMap[item.id] = item.stats;
        });
        setProjectStatsMap(newStatsMap);
      }
    } catch (err: any) {
      console.error("Failed to fetch projects:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to load projects. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    setCreateError(null);

    try {
      await projectApi.create({
        title: newTitle.trim(),
        description: newDescription.trim() || "No description provided.",
        dueDate: newDueDate,
      });

      setNewTitle("");
      setNewDescription("");
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error("Failed to create project:", err);
      setCreateError(
        err.message || err.response?.data?.message || "Failed to create project workspace."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <ProjectsHeader
        onOpenCreateModal={() => {
          setCreateError(null);
          setIsModalOpen(true);
        }}
      />

      <ProjectsFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        totalCount={projects.length}
        onSearchSubmit={handleSearchSubmit}
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
          <p className="text-xs text-slate-400">Loading project workspaces...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4">
          <FolderKanban className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Projects Found</h3>
            <p className="text-xs text-slate-400">
              There are no projects matching your current filter criteria.
            </p>
          </div>
          <button
            onClick={() => {
              setCreateError(null);
              setIsModalOpen(true);
            }}
            className="glass-button-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project._id}
              project={project}
              stats={
                projectStatsMap[project._id] || {
                  membersCount: 1,
                  tasksCount: 0,
                  completedTasks: 0,
                }
              }
              idx={idx}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newDueDate={newDueDate}
        setNewDueDate={setNewDueDate}
        creating={creating}
        createError={createError}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}