"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { motion, AnimatePresence } from "framer-motion";
import type { BreathingPattern } from "./breathing-pattern-selector";

interface BreathingPracticeProps {
  locale: string;
  duration: number;
  isPaused?: boolean;
  pattern: BreathingPattern;
}

export function BreathingPractice({
  locale,
  duration,
  isPaused = false,
  pattern,
}: BreathingPracticeProps) {
  const t = useTranslation(locale);
  const [phase, setPhase] = useState<
    "inhale" | "hold-in" | "exhale" | "hold-out" | "inhale-2"
  >("inhale");
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [inhaleCount, setInhaleCount] = useState(1); // For double inhale pattern
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);

  // Timing adjustment to compensate for the 1-second lag
  const timeAdjustment = 1.0; // Subtract 1 second from displayed time

  // Extract timing values from the pattern
  const {
    inhale: inhaleTime,
    holdAfterInhale,
    exhale: exhaleTime,
    holdAfterExhale,
    doubleInhale,
  } = pattern.timing;

  // Calculate total cycle time
  const cycleTime =
    inhaleTime +
    holdAfterInhale +
    exhaleTime +
    holdAfterExhale +
    (doubleInhale ? inhaleTime : 0);

  // Reset animation when pattern changes
  useEffect(() => {
    setPhase("inhale");
    setPhaseTime(0);
    setTotalElapsedTime(0);
    setInhaleCount(1);
    phaseStartTimeRef.current = null;
    sessionStartTimeRef.current = null;
    lastTimestampRef.current = null;
  }, [pattern]);

  useEffect(() => {
    if (isPaused) {
      // If paused, cancel the animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // Function to handle phase transitions with precise timing
    const transitionToNextPhase = (
      currentPhase: string,
      elapsedInPhase: number
    ) => {
      // Determine the next phase based on the current phase
      if (doubleInhale) {
        if (currentPhase === "inhale" && inhaleCount === 1) {
          if (elapsedInPhase >= inhaleTime) {
            setPhase("inhale-2");
            setInhaleCount(2);
            phaseStartTimeRef.current = performance.now();
            return true;
          }
        } else if (
          currentPhase === "inhale-2" ||
          (currentPhase === "inhale" && inhaleCount === 2)
        ) {
          if (elapsedInPhase >= inhaleTime) {
            setPhase("exhale");
            phaseStartTimeRef.current = performance.now();
            return true;
          }
        } else if (currentPhase === "exhale") {
          if (elapsedInPhase >= exhaleTime) {
            if (holdAfterExhale > 0) {
              setPhase("hold-out");
              phaseStartTimeRef.current = performance.now();
            } else {
              setPhase("inhale");
              setInhaleCount(1);
              phaseStartTimeRef.current = performance.now();
            }
            return true;
          }
        } else if (currentPhase === "hold-out") {
          if (elapsedInPhase >= holdAfterExhale) {
            setPhase("inhale");
            setInhaleCount(1);
            phaseStartTimeRef.current = performance.now();
            return true;
          }
        }
      } else {
        // Standard breathing pattern transitions
        if (currentPhase === "inhale") {
          if (elapsedInPhase >= inhaleTime) {
            if (holdAfterInhale > 0) {
              setPhase("hold-in");
              phaseStartTimeRef.current = performance.now();
            } else {
              setPhase("exhale");
              phaseStartTimeRef.current = performance.now();
            }
            return true;
          }
        } else if (currentPhase === "hold-in") {
          if (elapsedInPhase >= holdAfterInhale) {
            setPhase("exhale");
            phaseStartTimeRef.current = performance.now();
            return true;
          }
        } else if (currentPhase === "exhale") {
          if (elapsedInPhase >= exhaleTime) {
            if (holdAfterExhale > 0) {
              setPhase("hold-out");
              phaseStartTimeRef.current = performance.now();
            } else {
              setPhase("inhale");
              phaseStartTimeRef.current = performance.now();
            }
            return true;
          }
        } else if (currentPhase === "hold-out") {
          if (elapsedInPhase >= holdAfterExhale) {
            setPhase("inhale");
            phaseStartTimeRef.current = performance.now();
            return true;
          }
        }
      }
      return false;
    };

    const animate = (timestamp: number) => {
      // Initialize session start time if not set
      if (sessionStartTimeRef.current === null) {
        sessionStartTimeRef.current = timestamp;
      }

      // Initialize phase start time if not set
      if (phaseStartTimeRef.current === null) {
        phaseStartTimeRef.current = timestamp;
      }

      // Calculate elapsed time in the current phase
      const elapsedInPhase = (timestamp - phaseStartTimeRef.current) / 1000;

      // Calculate total elapsed time since session start
      const totalElapsed = (timestamp - sessionStartTimeRef.current) / 1000;

      // Update phase time and total elapsed time
      setPhaseTime(elapsedInPhase);
      setTotalElapsedTime(totalElapsed);

      // Check if we need to transition to the next phase
      transitionToNextPhase(phase, elapsedInPhase);

      // Store timestamp and request next animation frame
      lastTimestampRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isPaused,
    inhaleTime,
    holdAfterInhale,
    exhaleTime,
    holdAfterExhale,
    cycleTime,
    phase,
    doubleInhale,
    inhaleCount,
  ]);

  const getInstructionText = () => {
    switch (phase) {
      case "inhale":
        return doubleInhale && inhaleCount === 1
          ? locale === "en"
            ? "First Inhale"
            : "Primeira Inspiração"
          : locale === "en"
          ? "Inhale"
          : "Inspire";
      case "inhale-2":
        return locale === "en" ? "Second Inhale" : "Segunda Inspiração";
      case "hold-in":
        return locale === "en" ? "Hold" : "Segure";
      case "exhale":
        return locale === "en" ? "Exhale" : "Expire";
      case "hold-out":
        return locale === "en" ? "Rest" : "Descanse";
    }
  };

  const getInstructionSubtext = () => {
    switch (phase) {
      case "inhale":
        return doubleInhale && inhaleCount === 1
          ? locale === "en"
            ? "Breathe in partially"
            : "Respire parcialmente"
          : locale === "en"
          ? "Breathe in slowly"
          : "Respire lentamente";
      case "inhale-2":
        return locale === "en"
          ? "Fill your lungs completely"
          : "Encha completamente os pulmões";
      case "hold-in":
        return locale === "en" ? "Hold your breath" : "Segure a respiração";
      case "exhale":
        return doubleInhale
          ? locale === "en"
            ? "Release with a sigh"
            : "Solte com um suspiro"
          : locale === "en"
          ? "Breathe out slowly"
          : "Expire lentamente";
      case "hold-out":
        return locale === "en"
          ? "Pause before next breath"
          : "Pausa antes da próxima respiração";
    }
  };

  // Get the current phase duration for the countdown display
  const getCurrentPhaseDuration = () => {
    switch (phase) {
      case "inhale":
      case "inhale-2":
        return inhaleTime;
      case "hold-in":
        return holdAfterInhale;
      case "exhale":
        return exhaleTime;
      case "hold-out":
        return holdAfterExhale;
      default:
        return 0;
    }
  };

  // Calculate seconds remaining in the current phase with adjustment
  // Subtract 1 second to compensate for the lag
  const secondsRemaining = Math.max(
    Math.ceil(getCurrentPhaseDuration() - phaseTime - timeAdjustment),
    0
  );

  // Calculate continuous progress for the circular indicator
  // This creates a value that continuously increases and can be used for a non-resetting animation
  const continuousProgress = (totalElapsedTime % cycleTime) / cycleTime;

  // Ripple effect for inhale phase - slower and more gentle
  const rippleVariants = {
    animate: {
      opacity: [0, 0.3, 0],
      scale: [1, 1.3, 1],
      transition: {
        duration: 6, // Slower animation
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
      transition: { duration: inhaleTime * 1.2, ease: "easeInOut" }, // Slower animation
    },
    "inhale-2": {
      scale: 1.8, // Slightly larger for the second inhale
      backgroundColor: "rgba(0, 180, 180, 0.25)",
      transition: { duration: inhaleTime * 1.2, ease: "easeInOut" }, // Slower animation
    },
    "hold-in": {
      scale: 1.5,
      backgroundColor: "rgba(0, 180, 180, 0.3)",
      transition: { duration: holdAfterInhale * 1.2, ease: "easeInOut" }, // Slower animation
    },
    exhale: {
      scale: doubleInhale ? 0.9 : 1, // Smaller for sighing exhale
      backgroundColor: "rgba(0, 180, 180, 0.15)",
      transition: { duration: exhaleTime * 1.2, ease: "easeInOut" }, // Slower animation
    },
    "hold-out": {
      scale: 1,
      backgroundColor: "rgba(0, 180, 180, 0.1)",
      transition: { duration: holdAfterExhale * 1.2, ease: "easeInOut" }, // Slower animation
    },
    paused: {
      transition: { duration: 0 },
    },
  };

  // Get phase color based on current phase
  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
      case "inhale-2":
        return "rgba(0, 180, 180, 0.8)";
      case "hold-in":
        return "rgba(100, 200, 200, 0.8)";
      case "exhale":
        return "rgba(0, 150, 150, 0.8)";
      case "hold-out":
        return "rgba(0, 120, 120, 0.8)";
      default:
        return "rgba(0, 180, 180, 0.8)";
    }
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
          {(phase === "inhale" || phase === "inhale-2") && (
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
            {phase === "inhale-2" &&
              (locale === "en" ? "Breathe In More" : "Inspire Mais")}
            {phase === "hold-in" && (locale === "en" ? "Hold" : "Segure")}
            {phase === "exhale" && (locale === "en" ? "Breathe Out" : "Expire")}
            {phase === "hold-out" && (locale === "en" ? "Rest" : "Descanse")}
          </div>
        </motion.div>

        {/* Continuous progress indicator */}
        <div className="absolute inset-0 w-full h-full">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(0, 180, 180, 0.1)"
              strokeWidth="2"
            />
          </svg>

          {/* Continuous progress circle - never resets */}
          <svg
            className="absolute inset-0 w-full h-full rotate-90"
            viewBox="0 0 100 100"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke={getPhaseColor()}
              strokeWidth="4"
              strokeDasharray="301.59"
              strokeDashoffset={301.59 * (1 - continuousProgress)}
              strokeLinecap="round"
              transition={{ duration: isPaused ? 0 : 0.1, ease: "linear" }}
            />
          </svg>

          {/* Phase indicator dots */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Calculate positions for phase indicator dots */}
            {(() => {
              const dots = [];
              let currentAngle = 0;

              // Inhale phase dot
              dots.push(
                <circle
                  key="inhale-dot"
                  cx={50 + 48 * Math.cos((currentAngle - 90) * (Math.PI / 180))}
                  cy={50 + 48 * Math.sin((currentAngle - 90) * (Math.PI / 180))}
                  r="2"
                  fill={
                    phase === "inhale"
                      ? "rgba(0, 180, 180, 1)"
                      : "rgba(0, 180, 180, 0.4)"
                  }
                />
              );

              currentAngle += (inhaleTime / cycleTime) * 360;

              // Hold after inhale dot (if applicable)
              if (holdAfterInhale > 0) {
                dots.push(
                  <circle
                    key="hold-in-dot"
                    cx={
                      50 + 48 * Math.cos((currentAngle - 90) * (Math.PI / 180))
                    }
                    cy={
                      50 + 48 * Math.sin((currentAngle - 90) * (Math.PI / 180))
                    }
                    r="2"
                    fill={
                      phase === "hold-in"
                        ? "rgba(100, 200, 200, 1)"
                        : "rgba(100, 200, 200, 0.4)"
                    }
                  />
                );

                currentAngle += (holdAfterInhale / cycleTime) * 360;
              }

              // Exhale phase dot
              dots.push(
                <circle
                  key="exhale-dot"
                  cx={50 + 48 * Math.cos((currentAngle - 90) * (Math.PI / 180))}
                  cy={50 + 48 * Math.sin((currentAngle - 90) * (Math.PI / 180))}
                  r="2"
                  fill={
                    phase === "exhale"
                      ? "rgba(0, 150, 150, 1)"
                      : "rgba(0, 150, 150, 0.4)"
                  }
                />
              );

              currentAngle += (exhaleTime / cycleTime) * 360;

              // Hold after exhale dot (if applicable)
              if (holdAfterExhale > 0) {
                dots.push(
                  <circle
                    key="hold-out-dot"
                    cx={
                      50 + 48 * Math.cos((currentAngle - 90) * (Math.PI / 180))
                    }
                    cy={
                      50 + 48 * Math.sin((currentAngle - 90) * (Math.PI / 180))
                    }
                    r="2"
                    fill={
                      phase === "hold-out"
                        ? "rgba(0, 120, 120, 1)"
                        : "rgba(0, 120, 120, 0.4)"
                    }
                  />
                );
              }

              return dots;
            })()}
          </svg>
        </div>
      </div>

      {/* Phase timer */}
      <div className="mt-8 text-sm text-muted-foreground">
        {secondsRemaining}s
      </div>
    </div>
  );
}
