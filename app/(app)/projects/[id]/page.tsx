import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProjectDetailClient from "./ProjectDetailClient";

export default function ProjectDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
          <p className="text-xs text-slate-400">Loading workspace...</p>
        </div>
      }
    >
      <ProjectDetailClient />
    </Suspense>
  );
}