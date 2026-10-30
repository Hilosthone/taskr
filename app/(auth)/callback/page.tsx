"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { setAuthToken } from "@/lib/api";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("error") || searchParams.get("message");

    if (oauthError) {
      setError(oauthError || "Google authentication failed. Please try again.");
      return;
    }

    if (token) {
      setAuthToken(token);
      setSuccess(true);
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Fallback: If no token parameter in URL, attempt proceeding to dashboard
    setSuccess(true);
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center space-y-4 py-8 text-center"
    >
      {error ? (
        <div className="space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto shadow-lg">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Authentication Failed</h2>
            <p className="text-xs text-rose-300">{error}</p>
          </div>

          <Link
            href="/login"
            className="glass-button-primary w-full py-2.5 text-xs inline-flex items-center justify-center gap-2"
          >
            <span>Back to Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          <motion.div
            animate={{ rotate: success ? 0 : 360 }}
            transition={{ duration: 1.5, repeat: success ? 0 : Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-2xl bg-[var(--color-taskr-blue)]/20 border border-[var(--color-taskr-blue)]/40 flex items-center justify-center text-[var(--color-taskr-blue)] shadow-lg shadow-[var(--color-taskr-blue)]/30"
          >
            {success ? (
              <CheckCircle2 className="w-6 h-6 text-[var(--color-taskr-done)]" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin" />
            )}
          </motion.div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">
              {success ? "Authenticated Successfully!" : "Authenticating with Google..."}
            </h2>
            <p className="text-xs text-slate-400">
              {success
                ? "Setting up workspace session and redirecting..."
                : "Verifying OAuth response with Taskr servers."}
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
          <p className="text-xs text-slate-400">Processing OAuth response...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}