"use client"

import * as React from "react"
import { motion } from "motion/react";

interface ShiningTextProps {
  text: string;
  className?: string;
}

export function ShiningText({ text, className }: ShiningTextProps) {
  return (
    <motion.span
      className={`bg-[linear-gradient(110deg,#7C746C,35%,#bbb,50%,#7C746C,75%,#7C746C)] bg-[length:200%_100%] bg-clip-text text-transparent ${className || ''}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
}
