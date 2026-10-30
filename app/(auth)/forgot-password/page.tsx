"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset password step state
  const [showResetForm, setShowResetForm] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  // Step 1: Send Forgot Password Email (POST /api/v1/auth/forgot-password)
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Forgot password request error:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to send reset link. Please verify your email address."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password with Token (POST /api/v1/auth/reset-password)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await authApi.resetPassword(email, token, {
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      setResetComplete(true);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to reset password. Please verify your reset token."
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
      className="space-y-6"
    >
      {/* Global Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {resetComplete ? (
        /* Step 3: Success Completion State */
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-taskr-done)]/20 border border-[var(--color-taskr-done)]/30 flex items-center justify-center text-[var(--color-taskr-done)] mx-auto shadow-lg">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Password Reset Complete
            </h1>
            <p className="text-sm text-slate-400">
              Your password has been successfully updated.
            </p>
          </div>
          <Link
            href="/login"
            className="glass-button-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold group mt-4"
          >
            <span>Sign In to Taskr</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : showResetForm ? (
        /* Step 2: Reset Password Form */
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Set new password
            </h1>
            <p className="text-sm text-slate-400">
              Enter the token received in your email along with your new password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Reset Token</label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter verification token"
                  className="glass-input w-full pl-11 text-sm font-mono disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-11 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-11 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold group mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resetting password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : isSubmitted ? (
        /* Step 1 Confirmed: Email Sent State */
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-taskr-purple)]/20 border border-[var(--color-taskr-purple)]/30 flex items-center justify-center text-[var(--color-taskr-purple)] mx-auto shadow-lg">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Check your inbox
            </h1>
            <p className="text-sm text-slate-400">
              We sent password reset instructions to{" "}
              <span className="text-white font-medium">{email}</span>.
            </p>
          </div>

          <button
            onClick={() => {
              setError(null);
              setShowResetForm(true);
            }}
            className="glass-button-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold group mt-2 cursor-pointer"
          >
            <span>Enter Reset Token</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              setError(null);
              setIsSubmitted(false);
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors block mx-auto pt-2 cursor-pointer"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      ) : (
        /* Step 1 Form: Request Password Reset */
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Forgot password?
            </h1>
            <p className="text-sm text-slate-400">
              Enter your email address and we'll send you password recovery instructions.
            </p>
          </div>

          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Email address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="glass-input w-full pl-11 text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold group mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}