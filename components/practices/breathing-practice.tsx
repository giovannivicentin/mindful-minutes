"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { motion, AnimatePresence } from "framer-motion";
import type { BreathingPattern } from "./breathing-pattern-selector";

interface BreathingPracticeProperties {
  locale: string;
  isPaused?: boolean;
  pattern: BreathingPattern;
}

export function BreathingPractice({
  locale,
  isPaused = false,
  pattern,
}: BreathingPracticeProperties) {
  const translate = useTranslation(locale);

  // States to control breathing phases
  const [currentPhase, setCurrentPhase] = useState<
    "inhale" | "inhale-2" | "hold-in" | "exhale" | "hold-out"
  >("inhale");
  const [elapsedTimeInPhase, setElapsedTimeInPhase] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [inhaleIteration, setInhaleIteration] = useState(1);

  // Refs for animation frame control and timestamps
  const animationFrameId = useRef<number | null>(null);
  const phaseStartTime = useRef<number | null>(null);
  const sessionStartTime = useRef<number | null>(null);

  // Extract timing durations from the breathing pattern
  const {
    inhale: inhaleDuration,
    holdAfterInhale: holdInDuration,
    exhale: exhaleDuration,
    holdAfterExhale: holdOutDuration,
    doubleInhale: hasDoubleInhale = false,
  } = pattern.timing;

  // Total time of one full breathing cycle
  const cycleDuration =
    inhaleDuration +
    holdInDuration +
    exhaleDuration +
    holdOutDuration +
    (hasDoubleInhale ? inhaleDuration : 0);

  // Adjustment to compensate for display lag
  const displayTimeAdjustment = 1;

  // Reset when pattern changes
  useEffect(() => {
    setCurrentPhase("inhale");
    setElapsedTimeInPhase(0);
    setTotalElapsedTime(0);
    setInhaleIteration(1);
    phaseStartTime.current = null;
    sessionStartTime.current = null;
  }, [pattern]);

  // Animation loop
  useEffect(() => {
    if (isPaused) {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    function transitionToNextPhase(phaseKey: string, timeInPhase: number) {
      if (hasDoubleInhale) {
        if (
          phaseKey === "inhale" &&
          inhaleIteration === 1 &&
          timeInPhase >= inhaleDuration
        ) {
          setCurrentPhase("inhale-2");
          setInhaleIteration(2);
          phaseStartTime.current = performance.now();
          return;
        }
        if (
          (phaseKey === "inhale-2" ||
            (phaseKey === "inhale" && inhaleIteration === 2)) &&
          timeInPhase >= inhaleDuration
        ) {
          setCurrentPhase("exhale");
          phaseStartTime.current = performance.now();
          return;
        }
      }
      if (phaseKey === "inhale" && timeInPhase >= inhaleDuration) {
        if (holdInDuration > 0) {
          setCurrentPhase("hold-in");
        } else {
          setCurrentPhase("exhale");
        }
        phaseStartTime.current = performance.now();
        return;
      }
      if (phaseKey === "inhale-2" && timeInPhase >= inhaleDuration) {
        if (exhaleDuration > 0) {
          setCurrentPhase("exhale");
        }
        phaseStartTime.current = performance.now();
        return;
      }
      if (phaseKey === "hold-in" && timeInPhase >= holdInDuration) {
        setCurrentPhase("exhale");
        phaseStartTime.current = performance.now();
        return;
      }
      if (phaseKey === "exhale" && timeInPhase >= exhaleDuration) {
        if (holdOutDuration > 0) {
          setCurrentPhase("hold-out");
        } else {
          setCurrentPhase("inhale");
          setInhaleIteration(1);
        }
        phaseStartTime.current = performance.now();
        return;
      }
      if (phaseKey === "hold-out" && timeInPhase >= holdOutDuration) {
        setCurrentPhase("inhale");
        setInhaleIteration(1);
        phaseStartTime.current = performance.now();
      }
    }

    function animateFrame(timestamp: number) {
      if (sessionStartTime.current === null)
        sessionStartTime.current = timestamp;
      if (phaseStartTime.current === null) phaseStartTime.current = timestamp;
      const timeInPhase = (timestamp - phaseStartTime.current) / 1000;
      const timeSinceStart = (timestamp - sessionStartTime.current) / 1000;

      setElapsedTimeInPhase(timeInPhase);
      setTotalElapsedTime(timeSinceStart);
      transitionToNextPhase(currentPhase, timeInPhase);

      animationFrameId.current = requestAnimationFrame(animateFrame);
    }

    animationFrameId.current = requestAnimationFrame(animateFrame);
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [
    isPaused,
    inhaleDuration,
    holdInDuration,
    exhaleDuration,
    holdOutDuration,
    cycleDuration,
    currentPhase,
    hasDoubleInhale,
    inhaleIteration,
  ]);

  // Instruction text based on phase
  function getInstructionTitle() {
    switch (currentPhase) {
      case "inhale":
        return hasDoubleInhale && inhaleIteration === 1
          ? translate("First Inhale Partially")
          : translate("Breathe In");
      case "inhale-2":
        return translate("Fill Your Lungs");
      case "hold-in":
        return translate("Hold Breath");
      case "exhale":
        return translate("Breathe Out");
      case "hold-out":
        return translate("Rest");
    }
  }

  function getInstructionSubtitle() {
    switch (currentPhase) {
      case "inhale":
        return translate("Inhale slowly and deeply");
      case "inhale-2":
        return translate("Complete your inhale");
      case "hold-in":
        return translate("Hold your breath");
      case "exhale":
        return translate("Exhale gently");
      case "hold-out":
        return translate("Pause before next breath");
    }
  }

  // Remaining seconds in current phase
  function getRemainingTime() {
    const phaseDurations = {
      inhale: inhaleDuration,
      "inhale-2": inhaleDuration,
      "hold-in": holdInDuration,
      exhale: exhaleDuration,
      "hold-out": holdOutDuration,
    };
    const remaining =
      phaseDurations[currentPhase] - elapsedTimeInPhase - displayTimeAdjustment;
    return Math.max(Math.ceil(remaining), 0);
  }

  // Continuous cycle progress (0–1)
  const cycleProgress = (totalElapsedTime % cycleDuration) / cycleDuration;

  // Color for the progress stroke and active dots
  function getPhaseColor(): string {
    switch (currentPhase) {
      case "inhale":
      case "inhale-2":
        return "rgba(0,180,180,0.8)";
      case "hold-in":
        return "rgba(100,200,200,0.8)";
      case "exhale":
        return "rgba(0,150,150,0.8)";
      case "hold-out":
        return "rgba(0,120,120,0.8)";
      default:
        return "rgba(0,180,180,0.8)";
    }
  }

  // Build segments array for dot placement
  interface PhaseSegment {
    key: "inhale" | "inhale-2" | "hold-in" | "exhale" | "hold-out";
    duration: number;
    activeColor: string;
    inactiveColor: string;
  }

  const phaseSegments: PhaseSegment[] = [
    {
      key: "inhale",
      duration: inhaleDuration,
      activeColor: "rgba(0,180,180,1)",
      inactiveColor: "rgba(0,180,180,0.4)",
    },
  ];
  if (hasDoubleInhale) {
    phaseSegments.push({
      key: "inhale-2",
      duration: inhaleDuration,
      activeColor: "rgba(0,180,180,1)",
      inactiveColor: "rgba(0,180,180,0.4)",
    });
  }
  if (holdInDuration > 0) {
    phaseSegments.push({
      key: "hold-in",
      duration: holdInDuration,
      activeColor: "rgba(100,200,200,1)",
      inactiveColor: "rgba(100,200,200,0.4)",
    });
  }
  phaseSegments.push({
    key: "exhale",
    duration: exhaleDuration,
    activeColor: "rgba(0,150,150,1)",
    inactiveColor: "rgba(0,150,150,0.4)",
  });
  phaseSegments.push({
    key: "hold-out",
    duration: holdOutDuration,
    activeColor: "rgba(0,120,120,1)",
    inactiveColor: "rgba(0,120,120,0.4)",
  });

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-3xl font-semibold mb-2 text-center">
        {getInstructionTitle()}
      </div>
      <div className="text-lg text-muted-foreground mb-12 text-center">
        {getInstructionSubtitle()}
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer ripple effect */}
        <AnimatePresence>
          {(currentPhase === "inhale" || currentPhase === "inhale-2") && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 0.3, scale: 1.3 }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Main breathing circle */}
        <motion.div
          className="w-48 h-48 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center shadow-lg relative overflow-hidden"
          animate={currentPhase}
          variants={{
            inhale: {
              scale: 1.5,
              backgroundColor: "rgba(0,180,180,0.2)",
              transition: { duration: inhaleDuration * 1.2, ease: "easeInOut" },
            },
            "inhale-2": {
              scale: 1.8,
              backgroundColor: "rgba(0,180,180,0.25)",
              transition: { duration: inhaleDuration * 1.2, ease: "easeInOut" },
            },
            "hold-in": {
              scale: 1.5,
              backgroundColor: "rgba(0,180,180,0.3)",
              transition: { duration: holdInDuration * 1.2, ease: "easeInOut" },
            },
            exhale: {
              scale: hasDoubleInhale ? 0.9 : 1,
              backgroundColor: "rgba(0,180,180,0.15)",
              transition: { duration: exhaleDuration * 1.2, ease: "easeInOut" },
            },
            "hold-out": {
              scale: 1,
              backgroundColor: "rgba(0,180,180,0.1)",
              transition: {
                duration: holdOutDuration * 1.2,
                ease: "easeInOut",
              },
            },
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
          <div className="relative z-10 text-lg font-medium text-primary-foreground px-4 py-2 rounded-full bg-primary/40 backdrop-blur-sm">
            {getInstructionTitle()}
          </div>
        </motion.div>

        {/* Continuous progress line enveloping the circle */}
        <div className="absolute inset-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(0,180,180,0.1)"
              strokeWidth="2"
            />
          </svg>
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
              strokeDashoffset={301.59 * (1 - cycleProgress)}
              strokeLinecap="round"
              transition={{ duration: isPaused ? 0 : 0.1, ease: "linear" }}
            />
          </svg>
        </div>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        {getRemainingTime()}s
      </div>
    </div>
  );
}
