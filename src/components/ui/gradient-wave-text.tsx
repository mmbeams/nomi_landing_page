"use client";

import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type Align = "left" | "center" | "right";

const defaultColors = ["#01FA92", "#00d97e", "#33fb9f", "#00b868", "#66fcb8", "#01FA92"];

interface GradientWaveTextProps {
  children?: React.ReactNode;
  align?: Align;
  className?: string;

  speed?: number;
  paused?: boolean;
  delay?: number;
  repeat?: boolean;
  inView?: boolean;
  once?: boolean;

  radial?: boolean;
  bottomOffset?: number;
  bandGap?: number;
  bandCount?: number;
  customColors?: string[];
  baseColor?: string;

  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;

  ariaLabel?: string;
}


export function GradientWaveText({
  children,
  align = "center",
  className,

  speed = 1,
  paused = false,
  delay = 0,
  repeat = false,
  inView = false,
  once = true,

  radial = true,
  bottomOffset = 20,
  bandGap = 4,
  bandCount = 8,
  customColors,
  baseColor = "#000000",

  onClick,
  onMouseEnter,
  onMouseLeave,

  ariaLabel,
}: GradientWaveTextProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);
  const cyclesDoneRef = useRef(0);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);
  const startAtRef = useRef(0);
  const hasPlayedRef = useRef(false);

  const [isInView, setIsInView] = useState(!inView);
  const [isAnimating, setIsAnimating] = useState(false);

  const cycles = repeat ? 0 : 1;

  useEffect(() => {
    if (!inView) {
      setIsInView(true);
      return;
    }

    const node = spanRef.current?.parentElement;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasPlayedRef.current) return;
            setIsInView(true);
            hasPlayedRef.current = true;
          } else if (!once) {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, once]);

  const resolvedColors = useMemo(() => {
    return customColors?.length ? customColors : defaultColors;
  }, [customColors]);

  const buildGradient = useCallback((gi: number) => {
    const stops: string[] = [];
    stops.push(`${baseColor} ${gi}%`);
    for (let i = 0; i < bandCount && i < resolvedColors.length * 2; i++) {
      const color = resolvedColors[i % resolvedColors.length];
      const offset = gi + (i + 2) * bandGap;
      stops.push(`${color} ${offset}%`);
    }
    const endOffset = gi + (bandCount + 2) * bandGap;
    stops.push(`${baseColor} ${endOffset}%`);

    return radial
      ? `radial-gradient(circle at 50% 100%, ${stops.join(", ")})`
      : `linear-gradient(0deg, ${stops.join(", ")})`;
  }, [baseColor, resolvedColors, bandGap, bandCount, radial]);

  useEffect(() => {
    if (!isInView) return;

    tRef.current = -25;
    cyclesDoneRef.current = 0;
    finishedRef.current = false;
    startedRef.current = false;
    startAtRef.current = performance.now() + Math.max(0, (delay ?? 0) * 1000);
  }, [isInView, delay]);

  useEffect(() => {
    const span = spanRef.current;
    if (!span || !isInView) return;

    if (paused) {
      setIsAnimating(false);
      cancelAnimationFrame(rafRef.current);
      span.style.backgroundImage = "";
      return;
    }

    setIsAnimating(true);
    tRef.current = -25;
    cyclesDoneRef.current = 0;
    finishedRef.current = false;
    startedRef.current = true;

    const RANGE = 200;
    let last = performance.now();

    const tick = (now: number) => {
      if (finishedRef.current) {
        setIsAnimating(false);
        span.style.backgroundImage = "";
        return;
      }

      const dt = Math.min(64, now - last);
      last = now;

      const increment = (dt * speed) / 16.6667;
      let next = tRef.current + increment;

      if (cycles === 0) {
        if (next >= RANGE) next = next % RANGE;
        tRef.current = next;
        span.style.backgroundImage = buildGradient(next);
      } else {
        while (next >= RANGE && cyclesDoneRef.current < cycles) {
          next -= RANGE;
          cyclesDoneRef.current += 1;
        }

        if (cyclesDoneRef.current >= cycles) {
          tRef.current = RANGE;
          finishedRef.current = true;
          setIsAnimating(false);
          span.style.backgroundImage = "";
          return;
        } else {
          tRef.current = next;
          span.style.backgroundImage = buildGradient(next);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, paused, cycles, isInView, buildGradient]);

  const justifyContent =
    align === "left"
      ? "flex-start"
      : align === "right"
        ? "flex-end"
        : "center";

  return (
    <div
      className={cn(
        "flex w-full h-full items-center",
        className
      )}
      style={{ justifyContent }}
      aria-label={ariaLabel || undefined}
      role={ariaLabel ? "img" : undefined}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        ref={spanRef}
        style={{
          textAlign: align,
          color: baseColor,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          display: "inline-block",
          paddingBottom: `${bottomOffset}%`,
          marginBottom: `-${bottomOffset}%`,
          paddingInline: 2,
          ...(isAnimating ? {
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitFontSmoothing: "antialiased",
          } : {}),
        }}
      >
        {children}
      </span>
    </div>
  );
}

export default GradientWaveText;
