import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import client component with SSR disabled to bypass build-time prerendering
const ProjectDetailClient = dynamic(() => import("./ProjectDetailClient"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
      <p className="text-xs text-slate-400">Loading workspace....</p>
    </div>
  ),
});

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}