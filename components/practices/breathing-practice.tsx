"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { motion, AnimatePresence } from "framer-motion";

interface BreathingPracticeProps {
  locale: string;
  duration: number;
  isPaused?: boolean;
}

export function BreathingPractice({
  locale,
  duration,
  isPaused = false,
}: BreathingPracticeProps) {
  const t = useTranslation(locale);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [phaseTime, setPhaseTime] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Breathing pattern (in seconds) - removed rest phase
  const inhaleTime = 5; // Increased from 4 to 5 for a calmer pace
  const holdTime = 3; // Increased from 2 to 3 for a calmer pace
  const exhaleTime = 7; // Increased from 6 to 7 for a calmer pace
  const cycleTime = inhaleTime + holdTime + exhaleTime;

  useEffect(() => {
    if (isPaused) {
      // If paused, cancel the animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    let startTime: number | null = null;
    let elapsed = 0;

    // If we're resuming from a pause, use the current phase time
    if (lastTimestampRef.current !== null) {
      elapsed = phaseTime;

      if (phase === "inhale") {
        startTime = performance.now() - phaseTime * 1000;
      } else if (phase === "hold") {
        startTime = performance.now() - (phaseTime + inhaleTime) * 1000;
      } else if (phase === "exhale") {
        startTime =
          performance.now() - (phaseTime + inhaleTime + holdTime) * 1000;
      }
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      elapsed = (timestamp - startTime) / 1000; // Convert to seconds

      // Calculate current phase
      const cyclePosition = elapsed % cycleTime;

      if (cyclePosition < inhaleTime) {
        setPhase("inhale");
        setPhaseTime(cyclePosition);
        setPhaseProgress((cyclePosition / inhaleTime) * 100);
      } else if (cyclePosition < inhaleTime + holdTime) {
        setPhase("hold");
        setPhaseTime(cyclePosition - inhaleTime);
        setPhaseProgress(((cyclePosition - inhaleTime) / holdTime) * 100);
      } else {
        setPhase("exhale");
        setPhaseTime(cyclePosition - inhaleTime - holdTime);
        setPhaseProgress(
          ((cyclePosition - inhaleTime - holdTime) / exhaleTime) * 100
        );
      }

      lastTimestampRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, inhaleTime, holdTime, exhaleTime, cycleTime, phase, phaseTime]);

  const getInstructionText = () => {
    switch (phase) {
      case "inhale":
        return locale === "en" ? "Inhale" : "Inspire";
      case "hold":
        return locale === "en" ? "Hold" : "Segure";
      case "exhale":
        return locale === "en" ? "Exhale" : "Expire";
    }
  };

  const getInstructionSubtext = () => {
    switch (phase) {
      case "inhale":
        return locale === "en" ? "Breathe in slowly" : "Respire lentamente";
      case "hold":
        return locale === "en" ? "Hold your breath" : "Segure a respiração";
      case "exhale":
        return locale === "en" ? "Breathe out slowly" : "Expire lentamente";
    }
  };

  // Ripple effect for inhale phase - slower and more gentle
  const rippleVariants = {
    animate: {
      opacity: [0, 0.3, 0],
      scale: [1, 1.3, 1],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
    paused: {
      opacity: 0.2,
      scale: 1.15,
      transition: { duration: 0 },
    },
  };

  // Main circle animation - slower transitions with gentler easing
  const circleVariants = {
    inhale: {
      scale: 1.5,
      backgroundColor: "rgba(0, 180, 180, 0.2)",
      transition: { duration: inhaleTime, ease: "easeInOut" },
    },
    hold: {
      scale: 1.5,
      backgroundColor: "rgba(0, 180, 180, 0.3)",
      transition: { duration: holdTime, ease: "easeInOut" },
    },
    exhale: {
      scale: 1,
      backgroundColor: "rgba(0, 180, 180, 0.15)",
      transition: { duration: exhaleTime, ease: "easeInOut" },
    },
    paused: {
      transition: { duration: 0 },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-3xl font-semibold mb-2 text-center">
        {getInstructionText()}
      </div>
      <div className="text-lg text-muted-foreground mb-12 text-center">
        {getInstructionSubtext()}
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer ripple effect */}
        <AnimatePresence>
          {phase === "inhale" && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10"
              initial={{ opacity: 0, scale: 1 }}
              variants={rippleVariants}
              animate={isPaused ? "paused" : "animate"}
            />
          )}
        </AnimatePresence>

        {/* Main breathing circle */}
        <motion.div
          className="w-48 h-48 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center shadow-lg relative overflow-hidden"
          animate={isPaused ? "paused" : phase}
          variants={circleVariants}
        >
          {/* Inner gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />

          {/* Phase indicator */}
          <div className="relative z-10 text-lg font-medium text-primary-foreground px-4 py-2 rounded-full bg-primary/40 backdrop-blur-sm">
            {phase === "inhale" && (locale === "en" ? "Breathe In" : "Inspire")}
            {phase === "hold" && (locale === "en" ? "Hold" : "Segure")}
            {phase === "exhale" && (locale === "en" ? "Breathe Out" : "Expire")}
          </div>
        </motion.div>

        {/* Progress indicator */}
        <svg
          className="absolute inset-0 w-full h-full rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(0, 180, 180, 0.1)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(0, 180, 180, 0.6)"
            strokeWidth="2"
            strokeDasharray="301.59"
            initial={{ strokeDashoffset: 301.59 }}
            animate={{
              strokeDashoffset: 301.59 - (301.59 * phaseProgress) / 100,
            }}
            transition={{ duration: isPaused ? 0 : 0.1, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Phase timer */}
      <div className="mt-8 text-sm text-muted-foreground">
        {phase === "inhale" && `${Math.ceil(inhaleTime - phaseTime)}s`}
        {phase === "hold" && `${Math.ceil(holdTime - phaseTime)}s`}
        {phase === "exhale" && `${Math.ceil(exhaleTime - phaseTime)}s`}
      </div>
    </div>
  );
}
