"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, Github, Shield, Server, Cog, Activity, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "DevSecOps CI/CD Pipeline",
    description:
      "Comprehensive CI/CD pipeline with integrated security scanning and automated deployment.",
    icon: Shield,
    stack: ["Jenkins", "Docker", "Trivy", "GitHub", "AWS EC2"],
    link: "#",
    github: "#",
    branch: "main",
  },
  {
    title: "Central Repository Server",
    description:
      "Unified package management with automated synchronization and caching.",
    icon: Server,
    stack: ["Ubuntu Server", "APT", "Chocolatey", "Homebrew"],
    link: "#",
    github: "#",
    branch: "feature",
  },
  {
    title: "Infrastructure Automation",
    description:
      "Automated provisioning using Ansible playbooks for cloud infrastructure.",
    icon: Cog,
    stack: ["Ansible", "Linux", "Docker", "Nginx", "AWS EC2"],
    link: "#",
    github: "#",
    branch: "feature",
  },
  {
    title: "DevOps Monitoring Stack",
    description:
      "Real-time monitoring platform with Prometheus and Grafana dashboards.",
    icon: Activity,
    stack: ["Prometheus", "Grafana", "Docker", "Node Exporter"],
    link: "#",
    github: "#",
    branch: "main",
  },
];

function ProjectCard({
  project,
  index,
  isHovered,
  setHoveredIndex,
}: {
  project: (typeof projects)[0];
  index: number;
  isHovered: boolean;
  setHoveredIndex: (index: number | null) => void;
}) {
  const isBranch = project.branch === "feature";

  return (
    <motion.div
      initial={{ opacity: 0, x: isBranch ? -20 : 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="w-full max-w-[340px]"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -4 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-px rounded-xl"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
            boxShadow: "0 0 30px rgba(255,255,255,0.08)",
          }}
        />

        <div
          className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
            isHovered
              ? "border-white/20 bg-[#151515] shadow-[0_0_40px_rgba(255,255,255,0.06)]"
              : "border-[#1f1f1f] bg-[#111111]"
          }`}
        >
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
                boxShadow: isHovered
                  ? "0 0 20px rgba(255, 255, 255, 0.12)"
                  : "0 0 0px rgba(255, 255, 255, 0)",
              }}
              transition={{ duration: 0.25 }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                isHovered
                  ? "border-white/25 bg-[#1a1a1a]"
                  : "border-[#1f1f1f] bg-[#1a1a1a]"
              }`}
            >
              <project.icon
                className={`h-4 w-4 transition-colors duration-300 ${
                  isHovered ? "text-white" : "text-[#9ca3af]"
                }`}
              />
            </motion.div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 rounded-full transition-all duration-300 ${
                  isHovered
                    ? "bg-white/10 text-white hover:bg-white/15 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-[#9ca3af] hover:bg-[#1f1f1f] hover:text-white"
                }`}
                asChild
              >
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 rounded-full transition-all duration-300 ${
                  isHovered
                    ? "bg-white/10 text-white hover:bg-white/15 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-[#9ca3af] hover:bg-[#1f1f1f] hover:text-white"
                }`}
                asChild
              >
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  <span className="sr-only">Live Demo</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Title and description */}
          <h3 className="mb-2 text-sm font-semibold text-white">
            {project.title}
          </h3>
          <p className="mb-3 text-xs leading-relaxed text-[#9ca3af]">
            {project.description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className={`rounded-full border px-2 py-0.5 font-mono text-[9px] transition-all duration-300 ${
                  isHovered
                    ? "border-white/15 bg-white/8 text-white"
                    : "border-[#1f1f1f] bg-[#1a1a1a] text-[#9ca3af]"
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="relative scroll-mt-32 px-4 py-32">
      {/* Elevated background */}
      <div className="absolute inset-x-0 inset-y-16 -z-10 bg-[#0f0f0f]" />

      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            DevOps Projects
          </h2>
          <p className="mx-auto max-w-lg text-sm text-[#9ca3af]">
            Infrastructure evolution through automation
          </p>
        </motion.div>

        {/* Git Commit Tree */}
        <div className="relative">
          {/* Main vertical branch line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 overflow-hidden">
            {/* Base line */}
            <div className="absolute inset-0 bg-[#1f1f1f]" />
            {/* Animated flow */}
            <motion.div
              className="absolute inset-x-0 w-full"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
                height: "100px",
              }}
              animate={{
                y: ["-100px", "calc(100% + 100px)"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Branch header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mb-8 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(255,255,255,0.1)",
                    "0 0 25px rgba(255,255,255,0.15)",
                    "0 0 15px rgba(255,255,255,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-[#111111] px-4 py-2"
              >
                <GitBranch className="h-4 w-4 text-white" />
                <span className="text-xs font-medium text-white">main</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Commits */}
          <div className="relative space-y-6">
            {projects.map((project, index) => {
              const isBranch = project.branch === "feature";
              const isHovered = hoveredIndex === index;

              return (
                <div key={project.title} className="relative">
                  {/* Branch connector for feature branches */}
                  {isBranch && (
                    <svg
                      className="absolute left-1/2 top-4 -z-10 hidden h-8 w-24 -translate-x-full sm:block"
                      style={{ overflow: "visible" }}
                    >
                      {/* Curved branch line */}
                      <motion.path
                        d="M 96 0 Q 96 16, 72 16 L 0 16"
                        stroke="#1f1f1f"
                        strokeWidth="1"
                        fill="none"
                      />
                      {/* Animated pulse */}
                      <motion.path
                        d="M 96 0 Q 96 16, 72 16 L 0 16"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: [0, 1, 1],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      />
                    </svg>
                  )}

                  <div className={`flex items-start gap-4 ${isBranch ? "sm:mr-auto sm:max-w-[calc(50%-24px)] sm:pr-4" : "sm:ml-auto sm:max-w-[calc(50%-24px)] sm:pl-4"}`}>
                    {/* Left side cards (branch) or spacer */}
                    {isBranch ? (
                      <ProjectCard
                        project={project}
                        index={index}
                        isHovered={isHovered}
                        setHoveredIndex={setHoveredIndex}
                      />
                    ) : (
                      <div className="hidden sm:block sm:flex-1" />
                    )}

                    {/* Commit node on main branch */}
                    <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2">
                      <motion.div
                        animate={{
                          scale: isHovered ? 1.3 : 1,
                          boxShadow: isHovered
                            ? "0 0 20px rgba(255,255,255,0.25)"
                            : "0 0 10px rgba(255,255,255,0.1)",
                        }}
                        transition={{ duration: 0.25 }}
                        className="relative"
                      >
                        {/* Outer ring */}
                        <motion.div
                          className="absolute -inset-2 rounded-full border border-white/10"
                          animate={{
                            scale: isHovered ? [1, 1.5] : 1,
                            opacity: isHovered ? [0.5, 0] : 0.3,
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: isHovered ? Infinity : 0,
                          }}
                        />
                        {/* Node */}
                        <div
                          className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                            isHovered
                              ? "border-white bg-white"
                              : "border-white/40 bg-[#111111]"
                          }`}
                        />
                      </motion.div>
                    </div>

                    {/* Right side cards (main) or spacer */}
                    {!isBranch ? (
                      <ProjectCard
                        project={project}
                        index={index}
                        isHovered={isHovered}
                        setHoveredIndex={setHoveredIndex}
                      />
                    ) : (
                      <div className="hidden sm:block sm:flex-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Branch footer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mt-8 flex justify-center"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 15px rgba(255,255,255,0.08)",
                  "0 0 20px rgba(255,255,255,0.12)",
                  "0 0 15px rgba(255,255,255,0.08)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#111111]"
            >
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </motion.div>
          </motion.div>
        </div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[10px] text-[#9ca3af]"
        >
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-green-500"
            />
            <span>4 commits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span>2 branches</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>main</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
