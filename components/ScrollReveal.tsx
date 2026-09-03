"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

/** Soft scroll-in for sections and blocks */
export default function ScrollReveal({ children, className, delay = 0, as = "div" }: Props) {
  const Comp = as === "section" ? motion.section : motion.div;
  return (
    <Comp
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}
