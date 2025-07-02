"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { BreathingPattern } from "./breathing-pattern-selector";

interface BreathingPracticeProps {
  locale: string;
  duration: number;
  pattern: BreathingPattern;
  onComplete: () => void;
}

export function BreathingPractice({
  locale,
  duration,
  pattern,
  onComplete,
}: BreathingPracticeProps) {
  const t = useTranslation(locale);

  // Core breathing state
  const [phase, setPhase] = useState<
    "inhale" | "hold-in" | "exhale" | "hold-out" | "inhale-2"
  >("inhale");
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [inhaleCount, setInhaleCount] = useState(1);

  // Practice control state
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isPaused, setIsPaused] = useState(false);

  // Audio state management
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Refs
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const practiceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract timing values from the pattern
  const {
    inhale: inhaleTime,
    holdAfterInhale,
    exhale: exhaleTime,
    holdAfterExhale,
    doubleInhale,
  } = pattern.timing;
  const cycleTime =
    inhaleTime +
    holdAfterInhale +
    exhaleTime +
    holdAfterExhale +
    (doubleInhale ? inhaleTime : 0);

  // Initialize audio
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("/music/breathing.mp3");
          audioRef.current.loop = true;
          audioRef.current.volume = 0.3;
          audioRef.current.preload = "auto";

          // Audio event listeners
          audioRef.current.addEventListener("loadeddata", () => {
            setAudioLoaded(true);
            setAudioError(null);
          });

          audioRef.current.addEventListener("error", (e) => {
            console.error("Audio loading error:", e);
            setAudioError(
              locale === "en"
                ? "Unable to load background music. The practice will continue without audio."
                : "Não foi possível carregar a música de fundo. A prática continuará sem áudio."
            );
            setAudioLoaded(false);
          });

          audioRef.current.addEventListener("canplaythrough", () => {
            setAudioLoaded(true);
          });

          // Try to load the audio
          await audioRef.current.load();
        }
      } catch (error) {
        console.error("Audio initialization error:", error);
        setAudioError(
          locale === "en"
            ? "Background music is not available. The practice will continue without audio."
            : "A música de fundo não está disponível. A prática continuará sem áudio."
        );
      }
    };

    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("loadeddata", () => {});
        audioRef.current.removeEventListener("error", () => {});
        audioRef.current.removeEventListener("canplaythrough", () => {});
        audioRef.current = null;
      }
    };
  }, [locale]);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      if (isPlaying && !isPaused && !isAudioMuted) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback error:", error);
          setAudioError(
            locale === "en"
              ? "Unable to play background music. Please check your browser settings."
              : "Não foi possível reproduzir a música de fundo. Verifique as configurações do seu navegador."
          );
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isPaused, isAudioMuted, audioLoaded, locale]);

  // Practice timer logic
  useEffect(() => {
    setTimeRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isPlaying && !isPaused && isActive && timeRemaining > 0) {
      practiceIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Practice complete
            setIsPlaying(false);
            setIsComplete(true);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            clearInterval(practiceIntervalRef.current!);
            onComplete(); // Call the completion callback
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (practiceIntervalRef.current) {
        clearInterval(practiceIntervalRef.current);
      }
    }

    return () => {
      if (practiceIntervalRef.current) {
        clearInterval(practiceIntervalRef.current);
      }
    };
  }, [isPlaying, isPaused, isActive, timeRemaining, onComplete]);

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

  // Breathing animation logic
  useEffect(() => {
    if (isPaused || !isPlaying || !isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const transitionToNextPhase = (
      currentPhase: string,
      elapsedInPhase: number
    ) => {
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
      if (sessionStartTimeRef.current === null) {
        sessionStartTimeRef.current = timestamp;
      }

      if (phaseStartTimeRef.current === null) {
        phaseStartTimeRef.current = timestamp;
      }

      const elapsedInPhase = (timestamp - phaseStartTimeRef.current) / 1000;
      const totalElapsed = (timestamp - sessionStartTimeRef.current) / 1000;

      setPhaseTime(elapsedInPhase);
      setTotalElapsedTime(totalElapsed);

      transitionToNextPhase(phase, elapsedInPhase);

      lastTimestampRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isPaused,
    isPlaying,
    isActive,
    inhaleTime,
    holdAfterInhale,
    exhaleTime,
    holdAfterExhale,
    phase,
    doubleInhale,
    inhaleCount,
  ]);

  // Control functions
  const startPractice = () => {
    setIsActive(true);
    setIsPlaying(true);
    setIsComplete(false);
    phaseStartTimeRef.current = null;
    sessionStartTimeRef.current = null;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsPaused(!isPaused);
  };

  const resetPractice = () => {
    setIsPlaying(false);
    setIsActive(false);
    setIsComplete(false);
    setIsPaused(false);
    setPhase("inhale");
    setPhaseTime(0);
    setTotalElapsedTime(0);
    setInhaleCount(1);
    setTimeRemaining(duration * 60); // Ensure proper reset
    phaseStartTimeRef.current = null;
    sessionStartTimeRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Clear any running intervals
    if (practiceIntervalRef.current) {
      clearInterval(practiceIntervalRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const toggleAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  // Helper functions
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

  const formatTime = (seconds: number) => {
    // Handle NaN and invalid values
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  const secondsRemaining = Math.max(
    Math.ceil(getCurrentPhaseDuration() - phaseTime - 1),
    0
  );
  const continuousProgress = (totalElapsedTime % cycleTime) / cycleTime;

  // Ripple effect variants
  const rippleVariants = {
    animate: {
      opacity: [0, 0.3, 0],
      scale: [1, 1.3, 1],
      transition: {
        duration: 6,
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

  // Main circle animation variants
  const circleVariants = {
    inhale: {
      scale: 1.5,
      backgroundColor: "rgba(0, 180, 180, 0.2)",
      transition: { duration: inhaleTime * 1.2, ease: "easeInOut" },
    },
    "inhale-2": {
      scale: 1.8,
      backgroundColor: "rgba(0, 180, 180, 0.25)",
      transition: { duration: inhaleTime * 1.2, ease: "easeInOut" },
    },
    "hold-in": {
      scale: 1.5,
      backgroundColor: "rgba(0, 180, 180, 0.3)",
      transition: { duration: holdAfterInhale * 1.2, ease: "easeInOut" },
    },
    exhale: {
      scale: doubleInhale ? 0.9 : 1,
      backgroundColor: "rgba(0, 180, 180, 0.15)",
      transition: { duration: exhaleTime * 1.2, ease: "easeInOut" },
    },
    "hold-out": {
      scale: 1,
      backgroundColor: "rgba(0, 180, 180, 0.1)",
      transition: { duration: holdAfterExhale * 1.2, ease: "easeInOut" },
    },
    paused: {
      transition: { duration: 0 },
    },
  };

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Audio Error Alert */}
          <AnimatePresence>
            {audioError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    {audioError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome Screen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-light text-slate-800 dark:text-slate-200">
                {pattern.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {pattern.purpose}
              </p>
            </div>

            {/* Pattern timing display */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">
                {locale === "en" ? "Breathing Pattern" : "Padrão de Respiração"}
              </h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>{locale === "en" ? "Inhale:" : "Inspirar:"}</span>
                  <span>{inhaleTime}s</span>
                </div>
                {holdAfterInhale > 0 && (
                  <div className="flex justify-between">
                    <span>{locale === "en" ? "Hold:" : "Segurar:"}</span>
                    <span>{holdAfterInhale}s</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{locale === "en" ? "Exhale:" : "Expirar:"}</span>
                  <span>{exhaleTime}s</span>
                </div>
                {holdAfterExhale > 0 && (
                  <div className="flex justify-between">
                    <span>{locale === "en" ? "Rest:" : "Descansar:"}</span>
                    <span>{holdAfterExhale}s</span>
                  </div>
                )}
                {doubleInhale && (
                  <div className="text-xs text-primary mt-2">
                    {locale === "en"
                      ? "Double inhale pattern"
                      : "Padrão de dupla inspiração"}
                  </div>
                )}
              </div>
            </div>

            {/* Duration display */}
            <div className="text-center">
              <div className="text-2xl font-light text-slate-800 dark:text-slate-200">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {locale === "en" ? "Session Duration" : "Duração da Sessão"}
              </div>
            </div>

            {/* Start button */}
            <Button
              onClick={startPractice}
              size="lg"
              className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl text-lg font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              {locale === "en"
                ? "Start Breathing Practice"
                : "Iniciar Prática de Respiração"}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main breathing area */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/20">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Instruction text */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-semibold text-slate-800 dark:text-slate-200">
                {getInstructionText()}
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-400">
                {getInstructionSubtext()}
              </div>
            </div>

            {/* Breathing circle visualization */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Outer ripple effect */}
              <AnimatePresence>
                {(phase === "inhale" || phase === "inhale-2") && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/10"
                    initial={{ opacity: 0, scale: 1 }}
                    variants={rippleVariants}
                    animate={isPaused || !isPlaying ? "paused" : "animate"}
                  />
                )}
              </AnimatePresence>

              {/* Main breathing circle */}
              <motion.div
                className="w-48 h-48 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center shadow-lg relative overflow-hidden"
                animate={isPaused || !isPlaying ? "paused" : phase}
                variants={circleVariants}
              >
                {/* Inner gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />

                {/* Phase indicator */}
                <div className="relative z-10 text-lg font-medium text-primary-foreground px-4 py-2 rounded-full bg-primary/40 backdrop-blur-sm">
                  {phase === "inhale" &&
                    (locale === "en" ? "Breathe In" : "Inspire")}
                  {phase === "inhale-2" &&
                    (locale === "en" ? "Breathe In More" : "Inspire Mais")}
                  {phase === "hold-in" && (locale === "en" ? "Hold" : "Segure")}
                  {phase === "exhale" &&
                    (locale === "en" ? "Breathe Out" : "Expire")}
                  {phase === "hold-out" &&
                    (locale === "en" ? "Rest" : "Descanse")}
                </div>
              </motion.div>

              {/* Progress indicator */}
              <div className="absolute inset-0 w-full h-full">
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
                    transition={{
                      duration: isPaused || !isPlaying ? 0 : 0.1,
                      ease: "linear",
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Phase timer */}
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {secondsRemaining}s
            </div>
          </div>
        </div>

        {/* Consolidated Controls with Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            {!isComplete ? (
              <div className="flex flex-col items-center space-y-4">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {locale === "en" ? "Time Remaining" : "Tempo Restante"}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={togglePlayPause}
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                    aria-label={
                      isPlaying ? t("timer.pause") : t("timer.resume")
                    }
                  >
                    {isPlaying && !isPaused ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  {audioLoaded && (
                    <Button
                      onClick={toggleAudioMute}
                      variant="outline"
                      size="icon"
                      className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                      aria-label={isAudioMuted ? "Unmute" : "Mute"}
                    >
                      {isAudioMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={resetPractice}
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                    aria-label={t("timer.reset")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {locale === "en" ? "Complete!" : "Completo!"}
                </div>
                <Button onClick={resetPractice} className="px-6 py-2">
                  {locale === "en" ? "Practice Again" : "Praticar Novamente"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Completion state */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/50"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-white text-2xl"
              >
                ✓
              </motion.div>
            </div>
            <h3 className="text-xl font-medium text-green-800 dark:text-green-200">
              {locale === "en"
                ? "Breathing Practice Complete"
                : "Prática de Respiração Concluída"}
            </h3>
            <p className="text-green-700 dark:text-green-300">
              {locale === "en"
                ? "Take a moment to notice how you feel after this breathing exercise."
                : "Reserve um momento para notar como você se sente após este exercício de respiração."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
