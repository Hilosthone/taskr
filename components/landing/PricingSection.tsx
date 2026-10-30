"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small side projects.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    ctaText: "Get Started Free",
    features: [
      "Up to 3 active project workspaces",
      "Unlimited Kanban & List tasks",
      "Basic priority labeling",
      "Community support",
      "Standard role permissions",
    ],
  },
  {
    name: "Pro Team",
    description: "Designed for fast-moving product teams and agencies.",
    monthlyPrice: 15,
    yearlyPrice: 12,
    popular: true,
    ctaText: "Start 14-Day Free Trial",
    features: [
      "Unlimited project workspaces",
      "Unlimited team invitations",
      "Advanced member role permissions",
      "Real-time task activity filtering",
      "Priority email support",
      "Custom workspace branding",
    ],
  },
  {
    name: "Enterprise",
    description: "Dedicated infrastructure, security, and SLA guarantee.",
    monthlyPrice: 49,
    yearlyPrice: 39,
    popular: false,
    ctaText: "Contact Sales",
    features: [
      "Everything in Pro Team",
      "Dedicated database isolation",
      "SAML / Single Sign-On (SSO)",
      "Custom SLA & 99.9% uptime guarantee",
      "Dedicated account management",
      "Audit logs & compliance exports",
    ],
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-taskr-purple)]/10 border border-[var(--color-taskr-purple)]/20 text-[var(--color-taskr-purple)] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple plans for teams of any size
          </h2>
          <p className="text-base text-slate-400">
            Start free, then scale as your projects grow. No hidden platform fees.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-medium ${!isYearly ? "text-white" : "text-slate-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 rounded-full bg-white/10 p-1 relative border border-white/15 cursor-pointer transition-colors"
              aria-label="Toggle Billing Frequency"
            >
              <motion.div
                animate={{ x: isYearly ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 rounded-full bg-[var(--color-taskr-blue)] shadow-md"
              />
            </button>
            <span className={`text-xs font-medium ${isYearly ? "text-white" : "text-slate-400"}`}>
              Yearly <span className="text-[var(--color-taskr-done)] font-bold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`glass-panel p-8 rounded-2xl flex flex-col justify-between relative ${
                  plan.popular
                    ? "border-[var(--color-taskr-blue)]/50 bg-[var(--color-taskr-blue)]/[0.04] shadow-2xl shadow-[var(--color-taskr-blue)]/10"
                    : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--color-taskr-blue)] to-[var(--color-taskr-purple)] text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-slate-400">/ user / month</span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-[var(--color-taskr-done)] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6">
                  <Link
                    href="/signup"
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.popular
                        ? "glass-button-primary"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}