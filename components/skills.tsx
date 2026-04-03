"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Cloud,
  Container,
  GitBranch,
  Server,
  Shield,
  Terminal,
  Workflow,
  Globe,
  Cog,
} from "lucide-react";

const skills = [
  {
    name: "Docker",
    icon: Container,
    description: "Containerization & orchestration",
  },
  {
    name: "Jenkins",
    icon: Workflow,
    description: "CI/CD pipeline automation",
  },
  {
    name: "AWS",
    icon: Cloud,
    description: "Cloud infrastructure & services",
  },
  {
    name: "Linux",
    icon: Terminal,
    description: "System administration",
  },
  {
    name: "Ansible",
    icon: Cog,
    description: "Configuration management",
  },
  {
    name: "GitHub",
    icon: GitBranch,
    description: "Version control & Actions",
  },
  {
    name: "CI/CD",
    icon: Workflow,
    description: "Continuous integration & deployment",
  },
  {
    name: "Trivy",
    icon: Shield,
    description: "Security scanning",
  },
  {
    name: "Nginx",
    icon: Server,
    description: "Web server & reverse proxy",
  },
  {
    name: "Node.js",
    icon: Globe,
    description: "Server-side JavaScript",
  },
];

export function Skills() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="skills" className="relative scroll-mt-32 px-4 py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills & Technologies
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            The tools and technologies I use to build scalable, secure, and
            reliable infrastructure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {skills.map((skill, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                animate={{
                  y: isHovered ? -8 : 0,
                  scale: isHovered ? 1.03 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative rounded-xl border-2 p-6 transition-all duration-300 ${
                  isHovered
                    ? "border-white/20 bg-[#151515] shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                    : "border-border bg-card"
                }`}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-3 rounded-2xl"
                  animate={{
                    opacity: isHovered ? 0.5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04), transparent 70%)",
                  }}
                />

                <motion.div
                  animate={{
                    scale: isHovered ? 1.15 : 1,
                    boxShadow: isHovered
                      ? "0 0 25px rgba(255, 255, 255, 0.15)"
                      : "0 0 0px rgba(255, 255, 255, 0)",
                  }}
                  transition={{ duration: 0.3 }}
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isHovered
                      ? "border-white/30 bg-white/10"
                      : "border-border bg-muted"
                  }`}
                >
                  <skill.icon
                    className={`h-6 w-6 transition-colors duration-300 ${
                      isHovered ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <h3
                  className={`mb-1 font-semibold transition-colors duration-300 ${
                    isHovered ? "text-white" : "text-foreground"
                  }`}
                >
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {skill.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
