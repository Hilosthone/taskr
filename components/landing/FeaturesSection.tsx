"use client";

import { motion } from "framer-motion";
import {
  LayoutGrid,
  Users,
  Bell,
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
} from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Kanban & Table Boards",
    description:
      "Switch effortlessly between visual drag-and-drop Kanban columns and high-density tabular list views.",
    badge: "Flexible Views",
  },
  {
    icon: Users,
    title: "Team Collaboration & Roles",
    description:
      "Invite team members with fine-grained role permissions: Project Manager, Member, or Viewer access control.",
    badge: "Permissions",
  },
  {
    icon: Bell,
    title: "Real-time Dispatch & Invites",
    description:
      "Instant invitation dispatching with tokenized accept/reject links and automated email reminders.",
    badge: "Instant Invites",
  },
  {
    icon: Lock,
    title: "JWT & OAuth Security",
    description:
      "Enterprise-grade authentication featuring rotating JWT bearer tokens and Google One-Tap OAuth integration.",
    badge: "Secure",
  },
  {
    icon: Sparkles,
    title: "Smart Task Assignment",
    description:
      "Assign, reassign, or unassign tasks with instant status updates and completion tracking across workspace metrics.",
    badge: "Workflows",
  },
  {
    icon: Share2,
    title: "Granular Activity Filtering",
    description:
      "Filter workspace tasks by status, title, creation date, or specific team members in real-time.",
    badge: "Analytics",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--color-taskr-blue)]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-taskr-purple)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-taskr-blue)]/10 border border-[var(--color-taskr-blue)]/20 text-[var(--color-taskr-blue)] text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Built For Production Teams</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything you need to ship projects faster
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Taskr simplifies project tracking, task execution, and team delegation in a single dark glassmorphic workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-taskr-blue)] group-hover:scale-110 group-hover:bg-[var(--color-taskr-blue)] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[var(--color-taskr-blue)] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-taskr-done)]" />
                  <span>Ready out of the box</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}