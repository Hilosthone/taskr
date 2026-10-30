import { Suspense } from "react";
import Sidebar from "@/components/workspace/Sidebar";
import Topbar from "@/components/workspace/Topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-taskr-dark)] text-slate-100">
      {/* Suspense boundary for Sidebar navigation hooks */}
      <Suspense fallback={<aside className="w-64 hidden md:block bg-[var(--color-taskr-dark)] border-r border-white/10" />}>
        <Sidebar />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Suspense boundary for Topbar route hooks */}
        <Suspense fallback={<header className="h-16 border-b border-white/10 bg-[var(--color-taskr-dark)]" />}>
          <Topbar />
        </Suspense>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Suspense fallback={<div className="p-6 text-slate-400 text-xs">Loading page...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}