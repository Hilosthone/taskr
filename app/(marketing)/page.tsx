"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Sparkles,
  Zap,
  ShieldCheck,
  Plus,
} from "lucide-react";

// Interactive Mock Task Data for Hero Preview
const initialMockTasks = [
  {
    id: 1,
    title: "Design Glassmorphic Mobile UI",
    assignee: "Fathiat A.",
    avatarBg: "bg-emerald-500",
    status: "Done",
  },
  {
    id: 2,
    title: "Configure OAuth2 & JWT Security",
    assignee: "Hilosthone S.",
    avatarBg: "bg-blue-500",
    status: "Working on it",
  },
  {
    id: 3,
    title: "Setup Team Invitation Flow",
    assignee: "Sarah K.",
    avatarBg: "bg-purple-500",
    status: "Stuck",
  },
];

const statusStyles: Record<string, { bg: string; text: string; icon: any }> = {
  Done: {
    bg: "bg-[var(--color-taskr-done)]",
    text: "text-white",
    icon: CheckCircle2,
  },
  "Working on it": {
    bg: "bg-[var(--color-taskr-working)]",
    text: "text-white",
    icon: Clock,
  },
  Stuck: {
    bg: "bg-[var(--color-taskr-stuck)]",
    text: "text-white",
    icon: AlertCircle,
  },
};

export default function LandingPage() {
  const [tasks, setTasks] = useState(initialMockTasks);

  const cycleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextStatus =
            task.status === "Working on it"
              ? "Done"
              : task.status === "Done"
              ? "Stuck"
              : "Working on it";
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/15 text-xs sm:text-sm font-medium text-slate-200"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-taskr-working)]" />
            <span>Taskr 1.0.0 is live with OAS 3.0 API Integration</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-taskr-done)] animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Manage projects with <br />
            <span className="bg-gradient-to-r from-[var(--color-taskr-blue)] via-indigo-300 to-[var(--color-taskr-purple)] bg-clip-text text-transparent">
              glassy precision & speed
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed"
          >
            An astonishing workspace designed for modern teams. Streamline project invitations, member permissions, and task statuses in one intuitive interface.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className="glass-button-primary w-full sm:w-auto text-base px-8 py-3.5 flex items-center justify-center gap-2 group shadow-xl"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="glass-card w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-slate-200 text-center hover:text-white"
            >
              Live API Demo
            </Link>
          </motion.div>
        </div>

        {/* Interactive Live Hero Preview Widget */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
          className="mt-16 max-w-5xl mx-auto relative"
        >
          {/* Ambient Glow behind preview */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-taskr-blue)] to-[var(--color-taskr-purple)] rounded-3xl blur-2xl opacity-20" />

          {/* Glass Card Container */}
          <div className="relative glass-panel p-6 sm:p-8 overflow-hidden">
            {/* Mock Header Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  Taskr / Project Workspace
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                  Click status pill to cycle!
                </span>
              </div>
            </div>

            {/* Mock Task List Header */}
            <div className="grid grid-cols-12 gap-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 mt-2">
              <div className="col-span-6 sm:col-span-6">Task Name</div>
              <div className="col-span-3 sm:col-span-3">Assignee</div>
              <div className="col-span-3 sm:col-span-3 text-center">Status</div>
            </div>

            {/* Animated Interactive Rows */}
            <div className="divide-y divide-white/5">
              {tasks.map((task) => {
                const StatusIcon = statusStyles[task.status].icon;
                return (
                  <div
                    key={task.id}
                    className="grid grid-cols-12 gap-4 py-4 items-center group hover:bg-white/[0.02] transition-colors rounded-lg px-1"
                  >
                    <div className="col-span-6 sm:col-span-6 font-medium text-sm text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-taskr-blue)]" />
                      {task.title}
                    </div>

                    <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full ${task.avatarBg} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                      >
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-300 hidden sm:inline">
                        {task.assignee}
                      </span>
                    </div>

                    <div className="col-span-3 sm:col-span-3 flex justify-center">
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => cycleStatus(task.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs ${
                          statusStyles[task.status].bg
                        } ${
                          statusStyles[task.status].text
                        } flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{task.status}</span>
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white">
            Built for execution & speed
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Everything your team needs to move from idea to delivery without administrative friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-taskr-blue)]/20 border border-[var(--color-taskr-blue)]/30 flex items-center justify-center text-[var(--color-taskr-blue)]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Soft-Delete Security</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Never lose data unintentionally. PATCH-driven soft deletes let you archive tasks and projects safely.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-taskr-purple)]/20 border border-[var(--color-taskr-purple)]/30 flex items-center justify-center text-[var(--color-taskr-purple)]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Scheduled Invitations</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Draft, schedule, send, or reschedule project invitations with real-time tokenized acceptance workflows.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-taskr-done)]/20 border border-[var(--color-taskr-done)]/30 flex items-center justify-center text-[var(--color-taskr-done)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Google OAuth & Profiling</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Single-click Google OAuth login, avatar management, and email verification for immediate onboarding.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}