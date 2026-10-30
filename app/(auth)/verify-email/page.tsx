"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MailCheck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { authApi } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlEmail = searchParams.get("email") || "";
  const urlToken = searchParams.get("token") || "";

  const [email, setEmail] = useState(urlEmail);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-verify when URL parameters (email and token) are present
  useEffect(() => {
    if (urlEmail && urlToken && !verified && !verifying) {
      const executeVerification = async () => {
        setVerifying(true);
        setError(null);
        try {
          await authApi.verifyEmail(urlEmail, urlToken);
          setVerified(true);
        } catch (err: any) {
          console.error("Verification error:", err);
          setError(
            err.message ||
              err.response?.data?.message ||
              "Invalid or expired email verification link."
          );
        } finally {
          setVerifying(false);
        }
      };

      executeVerification();
    }
  }, [urlEmail, urlToken]);

  // Request new verification link (POST /api/v1/auth/resend-verification)
  const handleResend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Please enter your email address to resend verification.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to resend verification email. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 text-center"
    >
      {/* Icon Status */}
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-taskr-blue)]/20 border border-[var(--color-taskr-blue)]/30 flex items-center justify-center text-[var(--color-taskr-blue)] mx-auto shadow-lg shadow-[var(--color-taskr-blue)]/20">
        {verifying ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : verified ? (
          <CheckCircle2 className="w-7 h-7 text-[var(--color-taskr-done)]" />
        ) : (
          <MailCheck className="w-7 h-7" />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {verifying
            ? "Verifying your email..."
            : verified
            ? "Email Verified Successfully!"
            : "Check your email"}
        </h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          {verifying
            ? "Please wait while we confirm your email token with Taskr servers."
            : verified
            ? "Your account is now active and ready. You can sign in to your workspace."
            : "We sent a verification link to your email address. Click the link inside to verify your Taskr account."}
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-center gap-2.5 text-left"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Verified State CTA */}
      {verified ? (
        <Link
          href="/login"
          className="glass-button-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold group shadow-xl"
        >
          <span>Sign In to Your Account</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        /* Unverified / Resend State */
        <div className="space-y-4">
          {!urlEmail && (
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  disabled={loading || verifying}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="glass-input w-full pl-11 text-sm disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <div className="glass-card p-4 rounded-xl text-xs text-slate-300 border-white/10">
            Didn't receive the email? Check your spam folder or request a new
            verification link below.
          </div>

          {resent ? (
            <div className="p-3 rounded-xl bg-[var(--color-taskr-done)]/20 border border-[var(--color-taskr-done)]/30 text-xs font-medium text-[var(--color-taskr-done)] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verification link dispatched to your inbox!</span>
            </div>
          ) : (
            <button
              onClick={() => handleResend()}
              disabled={loading || verifying}
              className="glass-card w-full py-3 px-4 rounded-xl font-medium text-sm text-slate-200 flex items-center justify-center gap-2 hover:text-white hover:bg-white/5 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? "animate-spin text-[var(--color-taskr-blue)]" : ""
                }`}
              />
              <span>
                {loading ? "Resending link..." : "Resend Verification Email"}
              </span>
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400 pt-2">
        Verified your email?{" "}
        <Link
          href="/login"
          className="text-[var(--color-taskr-blue)] font-medium hover:underline inline-flex items-center gap-1"
        >
          <span>Back to Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </p>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-taskr-blue)]" />
          <p className="text-xs text-slate-400">Loading verification details...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}