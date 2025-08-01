"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimerSelector } from "@/components/timer-selector";
import { useTranslation } from "@/hooks/use-translation";
import { Leaf, Settings, Play } from "lucide-react";
import { BreathingPractice } from "@/components/practices/breathing-practice";
import { TratakPractice } from "@/components/practices/tratak-practice";
import { MuscleRelaxationPractice } from "@/components/practices/muscle-relaxation-practice";
import {
  BreathingPatternSelector,
  type BreathingPattern,
} from "@/components/practices/breathing-pattern-selector";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

interface PracticeModuleProps {
  practice: string;
  locale: string;
}

export function PracticeModule({ practice, locale }: PracticeModuleProps) {
  const t = useTranslation(locale);
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedBreathingPattern, setSelectedBreathingPattern] =
    useState("balanced");
  const { addSession } = useStore();

  const handleTimerSelect = (minutes: number) => {
    if (minutes && minutes > 0 && !isNaN(minutes)) {
      setSelectedDuration(minutes);
    }
  };

  const handleStart = () => {
    if (selectedDuration && selectedDuration > 0) {
      setIsActive(true);
    }
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

  const handleBack = () => {
    router.push(`/${locale}/practices`);
  };

  // Add a new function to handle going back to the selection screen
  const handleBackToSelection = () => {
    setIsActive(false);
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
            duration={selectedDuration}
            pattern={getSelectedBreathingPattern()}
            onComplete={handleComplete}
          />
        );
      case "tratak":
        return <TratakPractice locale={locale} duration={selectedDuration} />;
      case "muscle-relaxation":
        return (
          <MuscleRelaxationPractice
            locale={locale}
            duration={selectedDuration}
          />
        );
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
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isActive ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="p-3 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full"
                  >
                    <Leaf className="h-6 w-6 text-primary" />
                  </motion.div>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-light bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
                  {getPracticeTitle()}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {locale === "en"
                    ? "Customize your practice session"
                    : "Personalize sua sessão de prática"}
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <TimerSelector locale={locale} onSelect={handleTimerSelect} />
                </motion.div>

                {practice === "breathing" && selectedDuration && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <BreathingPatternSelector
                      locale={locale}
                      selectedPattern={selectedBreathingPattern}
                      onPatternChange={setSelectedBreathingPattern}
                    />
                  </motion.div>
                )}

                {selectedDuration && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="pt-4"
                  >
                    <Button
                      className="w-full py-4 text-lg font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
                      onClick={handleStart}
                    >
                      <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      {t("timer.start")}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="practice"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Practice Header */}
            <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSelection}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 group"
              >
                <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm font-medium">
                  {t("common.changeSettings")}
                </span>
              </Button>

              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {selectedDuration} {t("timer.minutes")}
                </span>
              </div>
            </div>

            {/* Practice Component */}
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {renderPracticeComponent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
