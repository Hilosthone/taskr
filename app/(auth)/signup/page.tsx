"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { authApi } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Strength Evaluator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-700", text: "text-slate-400" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    if (score === 2 || score === 3)
      return { score: 2, label: "Medium", color: "bg-amber-500", text: "text-amber-400" };
    return { score: 3, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.signup({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to create account. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://taskr-api.up.railway.app";
    window.location.href = `${backendUrl.replace(/\/$/, "")}/api/v1/auth/google`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-slate-400">
          Start organizing projects with Taskr today
        </p>
      </div>

      {/* Error Alert */}
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

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleAuth}
        type="button"
        disabled={loading}
        className="w-full glass-card py-3 px-4 rounded-xl font-medium text-sm text-slate-200 flex items-center justify-center gap-3 hover:text-white hover:bg-white/5 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
          />
        </svg>
        <span>Sign up with Google</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-[var(--color-taskr-dark)] px-3 text-xs text-slate-400 uppercase font-medium absolute">
          or email
        </span>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Separated First Name and Last Name Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">First Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                disabled={loading}
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="firstname"
                className="glass-input w-full pl-11 text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Last Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                disabled={loading}
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="lastname"
                className="glass-input w-full pl-11 text-sm disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Email Address Input */}
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

        {/* Password Input with Show/Hide Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass-input w-full pl-11 pr-11 text-sm disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Password Strength:</span>
                <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-1.5">
                <div
                  className={`rounded-full h-full transition-colors ${
                    strength.score >= 1 ? strength.color : "bg-white/10"
                  }`}
                />
                <div
                  className={`rounded-full h-full transition-colors ${
                    strength.score >= 2 ? strength.color : "bg-white/10"
                  }`}
                />
                <div
                  className={`rounded-full h-full transition-colors ${
                    strength.score >= 3 ? strength.color : "bg-white/10"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input with Show/Hide Toggle & Match Indication */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Confirm Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="glass-input w-full pl-11 pr-11 text-sm disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password Match Status Banner */}
          {confirmPassword.length > 0 && (
            <div className="pt-0.5">
              {passwordsMatch && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Passwords match</span>
                </div>
              )}
              {passwordsMismatch && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-400">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Passwords do not match</span>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || passwordsMismatch}
          className="glass-button-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold group mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[var(--color-taskr-blue)] font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}