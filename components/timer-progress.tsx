"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/use-translation";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProgressProps {
  durationMinutes: number;
  locale: string;
  onComplete: () => void;
  autoStart?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

export function TimerProgress({
  durationMinutes,
  locale,
  onComplete,
  autoStart = false,
  onActiveChange,
}: TimerProgressProps) {
  const t = useTranslation(locale);
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasNotifiedParentRef = useRef(false);

  // Initialize timer state
  useEffect(() => {
    // Validate durationMinutes to prevent NaN
    const validDuration =
      durationMinutes && !isNaN(durationMinutes) && durationMinutes > 0
        ? durationMinutes
        : 7;
    const totalSecs = validDuration * 60;

    // Reset timer when duration changes
    setSecondsRemaining(totalSecs);
    setIsComplete(false);

    // Only set initial active state if autoStart is true and we haven't notified parent yet
    if (autoStart && !hasNotifiedParentRef.current && validDuration > 0) {
      setIsActive(true);
      hasNotifiedParentRef.current = true;
    }
  }, [durationMinutes, autoStart]);

  // Handle timer active state changes
  useEffect(() => {
    // Notify parent component when active state changes
    if (onActiveChange) {
      onActiveChange(isActive);
    }
  }, [isActive, onActiveChange]);

  // Timer countdown logic
  useEffect(() => {
    if (isActive && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            setIsComplete(true);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, secondsRemaining, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    const validDuration =
      durationMinutes && !isNaN(durationMinutes) && durationMinutes > 0
        ? durationMinutes
        : 7;
    setSecondsRemaining(validDuration * 60);
    setIsActive(false);
    setIsComplete(false);
    hasNotifiedParentRef.current = false;
  };

  const formatTime = (seconds: number) => {
    // Handle NaN, negative, or invalid values
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    totalSeconds > 0
      ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold mb-2">
          {formatTime(secondsRemaining)}
        </div>
        <div className="text-sm text-muted-foreground">
          {secondsRemaining > 0
            ? `${Math.ceil(secondsRemaining / 60)} ${t("timer.minutes")} ${t(
                "timer.remaining"
              )}`
            : t("timer.complete")}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-center gap-4 mt-4">
        {!isComplete ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTimer}
              aria-label={isActive ? t("timer.pause") : t("timer.start")}
            >
              {isActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              aria-label={t("timer.reset")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button onClick={resetTimer}>{t("timer.reset")}</Button>
        )}
      </div>
    </div>
  );
}
