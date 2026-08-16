"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";

import { useRef } from "react";

interface ScrollParallaxProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}

export default function ScrollParallax({
  children,
  className = "",
  distance = 100,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [distance, 0, -distance]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}