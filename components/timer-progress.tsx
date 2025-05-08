"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "@/hooks/use-translation"
import { Play, Pause, RotateCcw } from "lucide-react"

interface TimerProgressProps {
  durationMinutes: number
  locale: string
  onComplete: () => void
  autoStart?: boolean
  onActiveChange?: (isActive: boolean) => void
}

export function TimerProgress({
  durationMinutes,
  locale,
  onComplete,
  autoStart = false,
  onActiveChange,
}: TimerProgressProps) {
  const t = useTranslation(locale)
  const totalSeconds = durationMinutes * 60
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds)
  const [isActive, setIsActive] = useState(autoStart)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Reset timer when duration changes
    setSecondsRemaining(durationMinutes * 60)
    setIsActive(autoStart)
    setIsComplete(false)
  }, [durationMinutes, autoStart])

  useEffect(() => {
    // Notify parent component when active state changes
    if (onActiveChange) {
      onActiveChange(isActive)
    }

    if (isActive && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsActive(false)
            setIsComplete(true)
            onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, secondsRemaining, onComplete, onActiveChange])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setSecondsRemaining(totalSeconds)
    setIsActive(false)
    setIsComplete(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold mb-2">{formatTime(secondsRemaining)}</div>
        <div className="text-sm text-muted-foreground">
          {secondsRemaining > 0
            ? `${Math.ceil(secondsRemaining / 60)} ${t("timer.minutes")} ${t("timer.remaining")}`
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
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={resetTimer} aria-label={t("timer.reset")}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button onClick={resetTimer}>{t("timer.reset")}</Button>
        )}
      </div>
    </div>
  )
}
