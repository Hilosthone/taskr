"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Primary Taskr Blue Glow */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--color-taskr-blue)]/20 blur-[140px]"
      />

      {/* Accent Taskr Purple Glow */}
      <motion.div
        animate={{
          x: [0, -90, 60, 0],
          y: [0, 80, -50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[var(--color-taskr-purple)]/15 blur-[150px]"
      />

      {/* Ambient Taskr Done Green Glow */}
      <motion.div
        animate={{
          x: [0, 50, -40, 0],
          y: [0, 70, -30, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-taskr-done)]/10 blur-[160px]"
      />
    </div>
  );
}