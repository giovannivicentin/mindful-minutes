"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimerSelector } from "@/components/timer-selector";
import { TimerProgress } from "@/components/timer-progress";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowLeft, Leaf } from "lucide-react";
import { BreathingPractice } from "@/components/practices/breathing-practice";
import { MeditationPractice } from "@/components/practices/meditation-practice";
import { TratakPractice } from "@/components/practices/tratak-practice";
import {
  BreathingPatternSelector,
  type BreathingPattern,
} from "@/components/practices/breathing-pattern-selector";
import { useStore } from "@/lib/store";

interface PracticeModuleProps {
  practice: string;
  locale: string;
}

export function PracticeModule({ practice, locale }: PracticeModuleProps) {
  const t = useTranslation(locale);
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedBreathingPattern, setSelectedBreathingPattern] =
    useState("balanced");
  const { addSession } = useStore();

  const handleTimerSelect = (minutes: number) => {
    setSelectedDuration(minutes);
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handleComplete = () => {
    // Record the completed session
    if (selectedDuration) {
      addSession({
        practice,
        duration: selectedDuration,
        date: new Date().toISOString(),
      });
    }
  };

  const handleTimerActiveChange = (active: boolean) => {
    setIsPaused(!active);
  };

  const handleBack = () => {
    router.push(`/${locale}/practices`);
  };

  // Add a new function to handle going back to the selection screen
  const handleBackToSelection = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  // Get the selected breathing pattern
  const getSelectedBreathingPattern = (): BreathingPattern => {
    const patterns = {
      balanced: {
        id: "balanced",
        title: t("practices.breathing.patterns.balanced.title"),
        purpose: t("practices.breathing.patterns.balanced.purpose"),
        timing: {
          inhale: 5,
          holdAfterInhale: 3,
          exhale: 7,
          holdAfterExhale: 0,
        },
      },
      box: {
        id: "box",
        title: t("practices.breathing.patterns.box.title"),
        purpose: t("practices.breathing.patterns.box.purpose"),
        timing: {
          inhale: 4,
          holdAfterInhale: 4,
          exhale: 4,
          holdAfterExhale: 4,
        },
      },
      relaxing: {
        id: "relaxing",
        title: t("practices.breathing.patterns.relaxing.title"),
        purpose: t("practices.breathing.patterns.relaxing.purpose"),
        timing: {
          inhale: 4,
          holdAfterInhale: 7,
          exhale: 8,
          holdAfterExhale: 0,
        },
      },
      "balanced-simple": {
        id: "balanced-simple",
        title: t("practices.breathing.patterns.balanced-simple.title"),
        purpose: t("practices.breathing.patterns.balanced-simple.purpose"),
        timing: {
          inhale: 5,
          holdAfterInhale: 0,
          exhale: 5,
          holdAfterExhale: 0,
        },
      },
      sighing: {
        id: "sighing",
        title: t("practices.breathing.patterns.sighing.title"),
        purpose: t("practices.breathing.patterns.sighing.purpose"),
        timing: {
          inhale: 3,
          holdAfterInhale: 0,
          exhale: 6,
          holdAfterExhale: 1,
          doubleInhale: true,
        },
      },
    };

    return patterns[selectedBreathingPattern as keyof typeof patterns];
  };

  const renderPracticeComponent = () => {
    if (!selectedDuration || !isActive) return null;

    switch (practice) {
      case "breathing":
        return (
          <BreathingPractice
            locale={locale}
            isPaused={isPaused}
            pattern={getSelectedBreathingPattern()}
          />
        );
      case "meditation":
        return (
          <MeditationPractice locale={locale} duration={selectedDuration} />
        );
      case "tratak":
        return (
          <TratakPractice
            locale={locale}
            duration={selectedDuration}
            isPaused={isPaused}
          />
        );
      // Other practice components will be added here
      default:
        return (
          <div className="flex items-center justify-center p-8 text-center">
            <p>{t("common.loading")}</p>
          </div>
        );
    }
  };

  const getPracticeTitle = () => {
    return t(`practices.${practice}.title`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-full">
            <Leaf className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-sm text-muted-foreground">
            Mindful Minutes
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center">
          <div className="p-2 bg-primary/10 rounded-full mb-2">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-2xl">{getPracticeTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isActive ? (
            <div className="space-y-6">
              <TimerSelector locale={locale} onSelect={handleTimerSelect} />

              {practice === "breathing" && selectedDuration && (
                <BreathingPatternSelector
                  locale={locale}
                  selectedPattern={selectedBreathingPattern}
                  onPatternChange={setSelectedBreathingPattern}
                />
              )}

              {selectedDuration && (
                <Button className="w-full" onClick={handleStart}>
                  {t("timer.start")}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSelection}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  {t("common.changeSettings")}
                </Button>

                <div className="text-sm text-muted-foreground">
                  {selectedDuration} {t("timer.minutes")}
                </div>
              </div>

              {/* Render the breathing animation first */}
              {renderPracticeComponent()}

              {/* Timer controls below the animation */}
              <div className="mt-8 pt-4 border-t">
                <TimerProgress
                  durationMinutes={selectedDuration || 7}
                  locale={locale}
                  onComplete={handleComplete}
                  autoStart={true}
                  onActiveChange={handleTimerActiveChange}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
