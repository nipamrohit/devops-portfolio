"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github/nipamrohit.com",
    label: "@nipamrohit",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "Nipam Rohit",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:nipamrohit.ce@gmail.com",
    label: "nipamrohit.ce@gmail.com",
  },
];

export function Contact() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="contact" className="relative scroll-mt-32 px-4 py-40">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Let&apos;s Connect
          </h2>
          <p className="mx-auto mb-20 max-w-xl text-muted-foreground">
            Interested in working together or have a question? I&apos;d love to
            hear from you. Reach out through any of the channels below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {contactLinks.map((link, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={link.name}
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
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`group h-auto rounded-xl border-2 px-6 py-4 transition-all duration-300 ${isHovered
                    ? "border-white/20 bg-[#151515] shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                    : "border-border bg-card hover:border-white/20 hover:bg-[#151515]"
                    }`}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                  >
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                        boxShadow: isHovered
                          ? "0 0 25px rgba(255, 255, 255, 0.15)"
                          : "0 0 0px rgba(255, 255, 255, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isHovered
                        ? "border-white/30 bg-white/10"
                        : "border-border bg-muted"
                        }`}
                    >
                      <link.icon
                        className={`h-5 w-5 transition-colors duration-300 ${isHovered ? "text-white" : "text-muted-foreground"
                          }`}
                      />
                    </motion.div>
                    <div className="text-left">
                      <div
                        className={`flex items-center gap-1 font-medium transition-colors duration-300 ${isHovered ? "text-white" : "text-foreground"
                          }`}
                      >
                        {link.name}
                        <ArrowUpRight
                          className={`h-3 w-3 transition-all duration-300 ${isHovered
                            ? "translate-x-0.5 opacity-100"
                            : "opacity-0"
                            }`}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {link.label}
                      </div>
                    </div>
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
