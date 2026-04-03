"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, Cpu, GitBranch, Rocket } from "lucide-react";

const highlights = [
  {
    icon: Rocket,
    title: "5+ Years Experience",
    description: "Building and scaling infrastructure",
  },
  {
    icon: GitBranch,
    title: "100+ Pipelines",
    description: "Automated CI/CD deployments",
  },
  {
    icon: Cpu,
    title: "Cloud Native",
    description: "AWS, Azure, GCP expertise",
  },
  {
    icon: Code2,
    title: "Infrastructure as Code",
    description: "Terraform, Ansible, CloudFormation",
  },
];

export function About() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="about" className="relative scroll-mt-32 px-4 py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About Me
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            I&apos;m a DevOps Engineer passionate about building reliable,
            scalable infrastructure. With expertise in cloud platforms,
            containerization, and automation, I help teams deliver software
            faster and more securely. I believe in infrastructure as code,
            continuous improvement, and creating systems that are both powerful
            and maintainable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {highlights.map((item, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                animate={{
                  y: isHovered ? -8 : 0,
                  scale: isHovered ? 1.02 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative rounded-2xl border-2 p-6 transition-all duration-300 ${
                  isHovered
                    ? "border-white/20 bg-[#151515] shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                    : "border-border bg-card"
                }`}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-4 rounded-3xl"
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
                    scale: isHovered ? 1.1 : 1,
                    boxShadow: isHovered
                      ? "0 0 25px rgba(255, 255, 255, 0.12)"
                      : "0 0 0px rgba(255, 255, 255, 0)",
                  }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isHovered
                      ? "border-white/30 bg-white/10"
                      : "border-border bg-muted"
                  }`}
                >
                  <item.icon
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
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
