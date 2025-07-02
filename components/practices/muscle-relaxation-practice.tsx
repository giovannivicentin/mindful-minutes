"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/lib/store";

interface MuscleRelaxationPracticeProps {
  locale: string;
  duration: number;
  isPaused?: boolean;
}

interface Segment {
  id: string;
  titleKey: string;
  instructionKey: string;
  duration: number;
  phases: Phase[];
}

interface Phase {
  name: string;
  duration: number;
  description: string;
}

export function MuscleRelaxationPractice({
  locale,
  duration,
  isPaused = false,
}: MuscleRelaxationPracticeProps) {
  const t = useTranslation(locale);
  const { addSession } = useStore();

  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [showTransition, setShowTransition] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Audio state management
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTimeRef = useRef<number | null>(null);
  const segmentStartTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Define all 15 segments with phases
  const getSegments = (): Segment[] => {
    const segmentDuration = Math.floor((duration * 60) / 15);

    const createPhases = (hasPreparation = false): Phase[] => {
      if (hasPreparation) {
        return [
          {
            name: "preparation",
            duration: segmentDuration,
            description: t("practices.muscle-relaxation.phases.preparation"),
          },
        ];
      }

      const phaseDuration = Math.floor(segmentDuration / 4);
      return [
        {
          name: "tension",
          duration: phaseDuration,
          description: t("practices.muscle-relaxation.phases.tension"),
        },
        {
          name: "hold",
          duration: phaseDuration,
          description: t("practices.muscle-relaxation.phases.hold"),
        },
        {
          name: "release",
          duration: phaseDuration,
          description: t("practices.muscle-relaxation.phases.release"),
        },
        {
          name: "rest",
          duration: segmentDuration - phaseDuration * 3,
          description: t("practices.muscle-relaxation.phases.rest"),
        },
      ];
    };

    return [
      {
        id: "introduction",
        titleKey: "practices.muscle-relaxation.introduction.title",
        instructionKey: "practices.muscle-relaxation.introduction.instruction",
        duration: segmentDuration,
        phases: createPhases(true),
      },
      {
        id: "toes",
        titleKey: "practices.muscle-relaxation.segments.toes.title",
        instructionKey: "practices.muscle-relaxation.segments.toes.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "feet",
        titleKey: "practices.muscle-relaxation.segments.feet.title",
        instructionKey: "practices.muscle-relaxation.segments.feet.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "calves",
        titleKey: "practices.muscle-relaxation.segments.calves.title",
        instructionKey:
          "practices.muscle-relaxation.segments.calves.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "thighs",
        titleKey: "practices.muscle-relaxation.segments.thighs.title",
        instructionKey:
          "practices.muscle-relaxation.segments.thighs.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "buttocks",
        titleKey: "practices.muscle-relaxation.segments.buttocks.title",
        instructionKey:
          "practices.muscle-relaxation.segments.buttocks.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "stomach",
        titleKey: "practices.muscle-relaxation.segments.stomach.title",
        instructionKey:
          "practices.muscle-relaxation.segments.stomach.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "hands",
        titleKey: "practices.muscle-relaxation.segments.hands.title",
        instructionKey:
          "practices.muscle-relaxation.segments.hands.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "forearms",
        titleKey: "practices.muscle-relaxation.segments.forearms.title",
        instructionKey:
          "practices.muscle-relaxation.segments.forearms.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "biceps",
        titleKey: "practices.muscle-relaxation.segments.biceps.title",
        instructionKey:
          "practices.muscle-relaxation.segments.biceps.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "shoulders",
        titleKey: "practices.muscle-relaxation.segments.shoulders.title",
        instructionKey:
          "practices.muscle-relaxation.segments.shoulders.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "neck",
        titleKey: "practices.muscle-relaxation.segments.neck.title",
        instructionKey: "practices.muscle-relaxation.segments.neck.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "face",
        titleKey: "practices.muscle-relaxation.segments.face.title",
        instructionKey: "practices.muscle-relaxation.segments.face.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "scalp",
        titleKey: "practices.muscle-relaxation.segments.scalp.title",
        instructionKey:
          "practices.muscle-relaxation.segments.scalp.instruction",
        duration: segmentDuration,
        phases: createPhases(),
      },
      {
        id: "fullbody",
        titleKey: "practices.muscle-relaxation.segments.fullbody.title",
        instructionKey:
          "practices.muscle-relaxation.segments.fullbody.instruction",
        duration: segmentDuration,
        phases: createPhases(true),
      },
    ];
  };

  const segments = getSegments();

  // Initialize audio
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("/music/muscle-relaxing.mp3");
          audioRef.current.loop = true;
          audioRef.current.volume = audioVolume;
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
  }, [locale, audioVolume]);

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

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  // Timer logic
  useEffect(() => {
    if (isPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();

        if (!phaseStartTimeRef.current) {
          phaseStartTimeRef.current = now;
        }
        if (!segmentStartTimeRef.current) {
          segmentStartTimeRef.current = now;
        }

        const currentSegmentData = segments[currentSegment];
        const currentPhaseData = currentSegmentData.phases[currentPhase];

        const phaseElapsed = (now - phaseStartTimeRef.current) / 1000;
        const segmentElapsed = (now - segmentStartTimeRef.current) / 1000;

        // Update phase progress
        const phaseProgressPercent = Math.min(
          (phaseElapsed / currentPhaseData.duration) * 100,
          100
        );
        setPhaseProgress(phaseProgressPercent);

        // Update segment progress
        const segmentProgressPercent = Math.min(
          (segmentElapsed / currentSegmentData.duration) * 100,
          100
        );
        setSegmentProgress(segmentProgressPercent);

        // Update total progress
        const totalElapsed =
          currentSegment * ((duration * 60) / 15) + segmentElapsed;
        const totalProgressPercent = Math.min(
          (totalElapsed / (duration * 60)) * 100,
          100
        );
        setTotalProgress(totalProgressPercent);

        // Update time remaining
        const remaining = Math.max(duration * 60 - totalElapsed, 0);
        setTimeRemaining(remaining);

        // Check if phase is complete
        if (phaseElapsed >= currentPhaseData.duration) {
          if (currentPhase < currentSegmentData.phases.length - 1) {
            // Move to next phase
            setCurrentPhase(currentPhase + 1);
            phaseStartTimeRef.current = now;
            setPhaseProgress(0);
          } else {
            // Move to next segment
            if (currentSegment < segments.length - 1) {
              showSegmentTransition();
              setCurrentSegment(currentSegment + 1);
              setCurrentPhase(0);
              segmentStartTimeRef.current = now;
              phaseStartTimeRef.current = now;
              setSegmentProgress(0);
              setPhaseProgress(0);
            } else {
              // Practice complete
              setIsPlaying(false);
              setIsComplete(true);
              // Record session completion
              addSession({
                practice: "muscle-relaxation",
                duration: duration,
                date: new Date().toISOString(),
              });
              if (audioRef.current) {
                audioRef.current.pause();
              }
              clearInterval(intervalRef.current!);
            }
          }
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isPlaying,
    isPaused,
    currentSegment,
    currentPhase,
    segments,
    duration,
    addSession,
  ]);

  // Show transition animation
  const showSegmentTransition = () => {
    setShowTransition(true);
    setTimeout(() => setShowTransition(false), 1500);
  };

  // Control functions
  const startPractice = () => {
    setIsPlaying(true);
    phaseStartTimeRef.current = Date.now();
    segmentStartTimeRef.current = Date.now();
  };

  const pausePractice = () => {
    setIsPlaying(false);
  };

  const resumePractice = () => {
    setIsPlaying(true);
    const now = Date.now();
    phaseStartTimeRef.current = now;
    segmentStartTimeRef.current = now;
  };

  const resetPractice = () => {
    setIsPlaying(false);
    setCurrentSegment(0);
    setCurrentPhase(0);
    setSegmentProgress(0);
    setPhaseProgress(0);
    setTotalProgress(0);
    setTimeRemaining(duration * 60);
    setIsComplete(false);
    phaseStartTimeRef.current = null;
    segmentStartTimeRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const skipToNext = () => {
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(currentSegment + 1);
      setCurrentPhase(0);
      setSegmentProgress(0);
      setPhaseProgress(0);
      const now = Date.now();
      segmentStartTimeRef.current = now;
      phaseStartTimeRef.current = now;
    }
  };

  const skipToPrevious = () => {
    if (currentSegment > 0) {
      setCurrentSegment(currentSegment - 1);
      setCurrentPhase(0);
      setSegmentProgress(0);
      setPhaseProgress(0);
      const now = Date.now();
      segmentStartTimeRef.current = now;
      phaseStartTimeRef.current = now;
    }
  };

  const toggleAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get phase color
  const getPhaseColor = (phaseName: string) => {
    switch (phaseName) {
      case "preparation":
        return "from-blue-400/20 to-blue-600/20";
      case "tension":
        return "from-orange-400/20 to-red-500/20";
      case "hold":
        return "from-red-400/20 to-red-600/20";
      case "release":
        return "from-green-400/20 to-emerald-500/20";
      case "rest":
        return "from-purple-400/20 to-indigo-500/20";
      default:
        return "from-gray-400/20 to-gray-600/20";
    }
  };

  const currentSegmentData = segments[currentSegment];
  const currentPhaseData = currentSegmentData?.phases[currentPhase];

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

        {/* Timer Display */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-muted-foreground">
            {isComplete
              ? t("timer.complete")
              : `${Math.ceil(timeRemaining / 60)} ${t("timer.minutes")} ${t(
                  "timer.remaining"
                )}`}
          </div>
        </div>

        {/* Transition Animation */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-white/20"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
                  </motion.div>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    {t("practices.muscle-relaxation.controls.next")}...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header with Progress */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-2xl md:text-3xl font-light text-slate-800 dark:text-slate-200">
              {t("practices.muscle-relaxation.title")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {t("practices.muscle-relaxation.controls.segment")}{" "}
              {currentSegment + 1}{" "}
              {t("practices.muscle-relaxation.controls.of")} {segments.length}
            </p>
          </motion.div>

          {/* Overall Progress Ring */}
          <div className="relative w-32 h-32 mx-auto">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * totalProgress) / 100}
                initial={{ strokeDashoffset: 283 }}
                animate={{
                  strokeDashoffset: 283 - (283 * totalProgress) / 100,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-light text-slate-800 dark:text-slate-200">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t("practices.muscle-relaxation.controls.timeRemaining")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <motion.div
          key={currentSegment}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/20"
        >
          {/* Current Segment Title */}
          <div className="text-center space-y-6 mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-light text-slate-800 dark:text-slate-200"
            >
              {t(currentSegmentData.titleKey)}
            </motion.h2>

            {/* Phase Indicator */}
            {currentPhaseData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-3"
              >
                <div
                  className={`px-6 py-3 rounded-full bg-gradient-to-r ${getPhaseColor(
                    currentPhaseData.name
                  )} border border-white/30 backdrop-blur-sm`}
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {currentPhaseData.description}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Instruction Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <p className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 font-light">
              {t(currentSegmentData.instructionKey)}
            </p>
          </motion.div>

          {/* Phase Progress Bar */}
          {currentPhaseData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getPhaseColor(
                    currentPhaseData.name
                  )} rounded-full`}
                  style={{ width: `${phaseProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${phaseProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Segment Dots */}
        <div className="flex justify-center space-x-2 px-4 overflow-x-auto">
          {segments.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale:
                  index === currentSegment
                    ? 1.2
                    : index < currentSegment
                    ? 1
                    : 0.8,
                opacity:
                  index === currentSegment
                    ? 1
                    : index < currentSegment
                    ? 0.8
                    : 0.4,
              }}
              transition={{ duration: 0.3 }}
              className={`w-3 h-3 rounded-full ${
                index === currentSegment
                  ? "bg-primary shadow-lg shadow-primary/30"
                  : index < currentSegment
                  ? "bg-green-500"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
            <div className="flex items-center space-x-4">
              {!isPlaying ? (
                <Button
                  onClick={startPractice}
                  size="lg"
                  className="rounded-xl px-8 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {totalProgress > 0
                    ? t("practices.muscle-relaxation.controls.resume")
                    : t("practices.muscle-relaxation.controls.start")}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={skipToPrevious}
                    variant="outline"
                    size="icon"
                    disabled={currentSegment === 0}
                    className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={pausePractice}
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={skipToNext}
                    variant="outline"
                    size="icon"
                    disabled={currentSegment >= segments.length - 1}
                    className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  {audioLoaded && (
                    <Button
                      onClick={toggleAudioMute}
                      variant="outline"
                      size="icon"
                      className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
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
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Completion State */}
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
              {t("practices.muscle-relaxation.controls.complete")}
            </h3>
            <p className="text-green-700 dark:text-green-300">
              {locale === "en"
                ? "Take a moment to notice how relaxed your body feels."
                : "Reserve um momento para notar como seu corpo se sente relaxado."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
