"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden scroll-mt-32 px-4"
    >
      {/* Radial gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <motion.div
          animate={{
            opacity: [0.02, 0.05, 0.02],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        {/* Availability badge with node styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(255,255,255,0.1)",
          }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 transition-all duration-300 hover:border-white/20 hover:bg-[#151515]"
        >
          <span className="relative flex h-2 w-2">
            <motion.span
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.75, 0, 0.75],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-500"
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm text-muted-foreground">
            Available for new opportunities
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          <span className="text-balance">Hi, I&apos;m </span>
          <span className="text-foreground">Nipam </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-3 font-mono text-xl text-muted-foreground sm:text-2xl"
        >
          DevOps Engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Building scalable infrastructure and robust CI/CD pipelines. I
          specialize in automating deployments, optimizing cloud resources, and
          creating secure, reliable systems that scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden rounded-full bg-foreground px-8 text-background transition-all duration-300 hover:bg-foreground/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            >
              <a href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-border bg-transparent text-foreground transition-all duration-300 hover:border-white/20 hover:bg-[#151515] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
            >
              <a href="#contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
