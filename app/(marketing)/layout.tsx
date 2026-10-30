import Navbar from "@/components/marketing/Navbar";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">{children}</main>

      {/* Glass Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-taskr-blue)] flex items-center justify-center text-white text-sm font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-semibold tracking-tight text-white">Taskr</span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; 2026 Taskr Inc. Crafted with glass, motion & precision.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}