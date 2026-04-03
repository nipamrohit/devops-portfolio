"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const tools = [
  { name: "Docker" },
  { name: "Kubernetes" },
  { name: "Jenkins" },
  { name: "AWS" },
  { name: "Terraform" },
  { name: "Ansible" },
  { name: "GitHub Actions" },
  { name: "Linux" },
  { name: "Nginx" },
  { name: "Prometheus" },
  { name: "Grafana" },
  { name: "Git" },
];

export function Tools() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="tools" className="relative scroll-mt-32 overflow-hidden px-4 py-40">
      {/* Elevated background */}
      <div className="absolute inset-x-0 inset-y-20 -z-10 bg-[#0f0f0f]" />

      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)]" />
      </div>
      
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tools I Work With
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A curated selection of tools and platforms that power my DevOps
            workflows.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6"
        >
          {tools.map((tool, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                animate={{
                  y: isHovered ? -8 : 0,
                  scale: isHovered ? 1.05 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all duration-300 ${
                  isHovered
                    ? "border-white/20 bg-[#151515] shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                    : "border-border bg-card"
                }`}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-2 rounded-2xl"
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
                  <span
                    className={`text-lg font-bold transition-colors duration-300 ${
                      isHovered ? "text-white" : "text-muted-foreground"
                    }`}
                  >
                    {tool.name.charAt(0)}
                  </span>
                </motion.div>
                <span
                  className={`text-center text-sm font-medium transition-colors duration-300 ${
                    isHovered ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {tool.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
