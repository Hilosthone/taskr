import Link from "next/link";
import { Layers } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative z-10">
      {/* Taskr Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-taskr-blue)] to-[var(--color-taskr-purple)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-taskr-blue)]/30 group-hover:scale-105 transition-transform duration-200">
          <Layers className="w-5 h-5" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">
          Task<span className="text-[var(--color-taskr-blue)]">r</span>
        </span>
      </Link>

      {/* Glass Card Wrapper */}
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 border border-white/15 relative overflow-hidden shadow-2xl">
        {children}
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center">
        By continuing, you agree to Taskr's Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}