"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Code,
  GitCommit,
  TestTube,
  Package,
  Shield,
  Rocket,
  Monitor,
} from "lucide-react";

const stages = [
  {
    icon: Code,
    title: "Code",
    description: "Write clean, maintainable code with proper version control practices.",
  },
  {
    icon: GitCommit,
    title: "Commit",
    description: "Push changes to repository with semantic versioning and clear commit messages.",
  },
  {
    icon: TestTube,
    title: "Test",
    description: "Run automated unit tests, integration tests, and code coverage analysis.",
  },
  {
    icon: Package,
    title: "Build",
    description: "Compile and package applications into optimized container images.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Scan for vulnerabilities, secrets, and compliance issues automatically.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description: "Release to staging and production environments with zero-downtime strategies.",
  },
  {
    icon: Monitor,
    title: "Monitor",
    description: "Track performance metrics, logs, and alerts for continuous improvement.",
  },
];

export function Workflow() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="workflow" className="relative scroll-mt-32 overflow-hidden px-4 py-32">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            CI/CD Pipeline
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A streamlined pipeline that takes code from commit to
            production with security and reliability built in.
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Main pipeline container */}
          <div className="relative flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:gap-0">
            {/* Connecting line for desktop */}
            <div className="absolute left-[5%] right-[5%] top-[44px] hidden h-[2px] lg:block">
              <div className="h-full w-full bg-border" />
              {/* Animated flow line */}
              <motion.div
                className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Connecting line for mobile */}
            <div className="absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 lg:hidden">
              <div className="h-full w-full bg-border" />
              <motion.div
                className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-white/40 to-transparent"
                animate={{
                  y: ["-100%", "100%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {stages.map((stage, index) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative z-10 flex flex-col items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Node */}
                <motion.div
                  animate={{
                    scale: hoveredIndex === index ? 1.15 : 1,
                    y: hoveredIndex === index ? -4 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: hoveredIndex === index 
                        ? "0 0 30px rgba(255, 255, 255, 0.25), 0 0 60px rgba(59, 130, 246, 0.15)"
                        : "0 0 0px rgba(255, 255, 255, 0)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Pulse animation for active state */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                    animate={{
                      scale: hoveredIndex === index ? [1, 1.3, 1] : 1,
                      opacity: hoveredIndex === index ? [0.5, 0, 0.5] : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: hoveredIndex === index ? Infinity : 0,
                      ease: "easeOut",
                    }}
                  />

                  {/* Main node circle */}
                  <div
                    className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      hoveredIndex === index
                        ? "border-white/40 bg-card-hover shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                        : "border-border bg-card"
                    }`}
                  >
                    <stage.icon
                      className={`h-8 w-8 transition-colors duration-300 ${
                        hoveredIndex === index ? "text-white" : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  {/* Stage number badge */}
                  <div
                    className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 ${
                      hoveredIndex === index
                        ? "border-white/30 bg-white text-black"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                </motion.div>

                {/* Label */}
                <motion.div
                  className="mt-4 text-center"
                  animate={{
                    y: hoveredIndex === index ? -2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h3
                    className={`font-semibold transition-colors duration-300 ${
                      hoveredIndex === index ? "text-white" : "text-foreground"
                    }`}
                  >
                    {stage.title}
                  </h3>
                </motion.div>

                {/* Expanded description on hover */}
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? 0 : 10,
                    height: hoveredIndex === index ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 max-w-[160px] overflow-hidden text-center"
                >
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Pipeline status indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Pipeline Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/30" />
              <span className="text-sm text-muted-foreground">7 Stages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Automated Flow</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
