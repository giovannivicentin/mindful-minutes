"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimerSelector } from "@/components/timer-selector"
import { TimerProgress } from "@/components/timer-progress"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft } from "lucide-react"
import { BreathingPractice } from "@/components/practices/breathing-practice"
import { MeditationPractice } from "@/components/practices/meditation-practice"
import { TratakPractice } from "@/components/practices/tratak-practice"
import { useStore } from "@/lib/store"

interface PracticeModuleProps {
  practice: string
  locale: string
}

export function PracticeModule({ practice, locale }: PracticeModuleProps) {
  const t = useTranslation(locale)
  const router = useRouter()
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const { addSession } = useStore()

  const handleTimerSelect = (minutes: number) => {
    setSelectedDuration(minutes)
  }

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
  }

  const handleComplete = () => {
    // Record the completed session
    if (selectedDuration) {
      addSession({
        practice,
        duration: selectedDuration,
        date: new Date().toISOString(),
      })
    }
  }

  const handleTimerActiveChange = (active: boolean) => {
    setIsPaused(!active)
  }

  const handleBack = () => {
    router.push(`/${locale}/practices`)
  }

  const renderPracticeComponent = () => {
    if (!selectedDuration || !isActive) return null

    switch (practice) {
      case "breathing":
        return <BreathingPractice locale={locale} duration={selectedDuration} isPaused={isPaused} />
      case "meditation":
        return <MeditationPractice locale={locale} duration={selectedDuration} />
      case "tratak":
        return <TratakPractice locale={locale} duration={selectedDuration} isPaused={isPaused} />
      // Other practice components will be added here
      default:
        return (
          <div className="flex items-center justify-center p-8 text-center">
            <p>{t("common.loading")}</p>
          </div>
        )
    }
  }

  const getPracticeTitle = () => {
    return t(`practices.${practice}.title`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-4 flex items-center gap-2" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4" />
        {t("common.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{getPracticeTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isActive ? (
            <div className="space-y-6">
              <TimerSelector locale={locale} onSelect={handleTimerSelect} />

              {selectedDuration && (
                <Button className="w-full" onClick={handleStart}>
                  {t("timer.start")}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <TimerProgress
                durationMinutes={selectedDuration || 7}
                locale={locale}
                onComplete={handleComplete}
                autoStart={true}
                onActiveChange={handleTimerActiveChange}
              />

              {renderPracticeComponent()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
