"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border px-4 py-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Terminal className="h-4 w-4 text-foreground" />
          <span className="font-mono text-sm">
            Built with Next.js & Framer Motion
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} Your Name. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
