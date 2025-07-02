"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Award } from "lucide-react";

interface StreakDisplayProps {
  locale: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakProgress: number;
  lastPracticeDate: string | null;
  streakStatus: "active" | "broken" | "new";
}

export function StreakDisplay({ locale }: StreakDisplayProps) {
  const t = useTranslation(locale);
  const { sessions } = useStore();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    streakProgress: 0,
    lastPracticeDate: null,
    streakStatus: "new",
  });

  useEffect(() => {
    const calculateStreakData = () => {
      if (sessions.length === 0) {
        setStreakData({
          currentStreak: 0,
          longestStreak: 0,
          streakProgress: 0,
          lastPracticeDate: null,
          streakStatus: "new",
        });
        return;
      }

      // Sort sessions by date
      const sortedSessions = [...sessions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Get unique practice dates
      const practiceDates = Array.from(
        new Set(
          sortedSessions.map(
            (session) => new Date(session.date).toISOString().split("T")[0]
          )
        )
      ).sort();

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if there's a practice today
      const todayString = today.toISOString().split("T")[0];
      const hasToday = practiceDates.includes(todayString);

      // Start from today or yesterday
      const checkDate = new Date(today);
      if (!hasToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Count consecutive days backwards
      while (checkDate >= new Date(practiceDates[0])) {
        const checkDateString = checkDate.toISOString().split("T")[0];
        if (practiceDates.includes(checkDateString)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: Date | null = null;

      practiceDates.forEach((dateString) => {
        const currentDate = new Date(dateString);

        if (lastDate === null) {
          tempStreak = 1;
        } else {
          const dayDiff = Math.floor(
            (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }

        lastDate = currentDate;
      });
      longestStreak = Math.max(longestStreak, tempStreak);

      // Determine streak status
      let streakStatus: "active" | "broken" | "new" = "new";
      const lastPracticeDate = practiceDates[practiceDates.length - 1];
      const lastPractice = new Date(lastPracticeDate);
      const daysSinceLastPractice = Math.floor(
        (today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (currentStreak > 0) {
        if (daysSinceLastPractice <= 1) {
          streakStatus = "active";
        } else {
          streakStatus = "broken";
        }
      }

      // Calculate progress towards next milestone
      const nextMilestone = getNextMilestone(currentStreak);
      const streakProgress =
        nextMilestone > 0 ? (currentStreak / nextMilestone) * 100 : 100;

      setStreakData({
        currentStreak,
        longestStreak,
        streakProgress,
        lastPracticeDate,
        streakStatus,
      });
    };

    calculateStreakData();
  }, [sessions]);

  const getNextMilestone = (streak: number): number => {
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
    return milestones.find((milestone) => milestone > streak) || 0;
  };

  const getStreakMessage = () => {
    const { currentStreak, streakStatus } = streakData;

    if (streakStatus === "new") {
      return locale === "en"
        ? "Start your first streak!"
        : "Comece sua primeira sequência!";
    }

    if (streakStatus === "broken") {
      return locale === "en"
        ? "Ready to start a new streak?"
        : "Pronto para começar uma nova sequência?";
    }

    if (currentStreak === 1) {
      return locale === "en"
        ? "Great start! Keep it going!"
        : "Ótimo começo! Continue assim!";
    }

    if (currentStreak < 7) {
      return locale === "en" ? "Building momentum!" : "Construindo momentum!";
    }

    if (currentStreak < 30) {
      return locale === "en" ? "You're on fire!" : "Você está pegando fogo!";
    }

    return locale === "en" ? "Incredible dedication!" : "Dedicação incrível!";
  };

  const getStreakColor = () => {
    const { currentStreak, streakStatus } = streakData;

    if (streakStatus === "broken" || streakStatus === "new") {
      return "text-slate-500 dark:text-slate-400";
    }

    if (currentStreak < 3) return "text-orange-500";
    if (currentStreak < 7) return "text-yellow-500";
    if (currentStreak < 30) return "text-red-500";
    return "text-purple-500";
  };

  const getStreakIcon = () => {
    const { streakStatus } = streakData;

    if (streakStatus === "active") {
      return <Flame className="h-8 w-8 text-orange-500 animate-pulse" />;
    }

    return <Flame className="h-8 w-8 text-slate-400" />;
  };

  const nextMilestone = getNextMilestone(streakData.currentStreak);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Streak Card */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-full">
              {getStreakIcon()}
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                {locale === "en" ? "Current Streak" : "Sequência Atual"}
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getStreakMessage()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className={`text-6xl font-bold ${getStreakColor()}`}
            >
              {streakData.currentStreak}
            </motion.div>
            <div className="text-lg text-slate-600 dark:text-slate-400 mt-2">
              {streakData.currentStreak === 1
                ? locale === "en"
                  ? "day"
                  : "dia"
                : locale === "en"
                ? "days"
                : "dias"}
            </div>
          </div>

          {/* Progress to next milestone */}
          {nextMilestone > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  {locale === "en" ? "Next milestone" : "Próxima meta"}
                </span>
                <span className="font-medium">
                  {nextMilestone} {locale === "en" ? "days" : "dias"}
                </span>
              </div>
              <Progress value={streakData.streakProgress} className="h-3" />
              <div className="text-xs text-center text-slate-500 dark:text-slate-400">
                {nextMilestone - streakData.currentStreak}{" "}
                {locale === "en" ? "days to go" : "dias restantes"}
              </div>
            </div>
          )}

          {/* Streak status indicator */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div
              className={`w-3 h-3 rounded-full ${
                streakData.streakStatus === "active"
                  ? "bg-green-500 animate-pulse"
                  : streakData.streakStatus === "broken"
                  ? "bg-red-500"
                  : "bg-slate-400"
              }`}
            />
            <span className="text-sm font-medium">
              {streakData.streakStatus === "active"
                ? locale === "en"
                  ? "Active Streak"
                  : "Sequência Ativa"
                : streakData.streakStatus === "broken"
                ? locale === "en"
                  ? "Streak Broken"
                  : "Sequência Quebrada"
                : locale === "en"
                ? "No Streak Yet"
                : "Ainda Sem Sequência"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Longest Streak & Stats Card */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-full">
              <Award className="h-8 w-8 text-purple-500" />
            </div>
            <CardTitle className="text-xl font-semibold">
              {locale === "en" ? "Personal Best" : "Melhor Pessoal"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
              className="text-5xl font-bold text-purple-500"
            >
              {streakData.longestStreak}
            </motion.div>
            <div className="text-lg text-slate-600 dark:text-slate-400 mt-2">
              {locale === "en" ? "longest streak" : "maior sequência"}
            </div>
          </div>

          {/* Achievement levels */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">
              {locale === "en"
                ? "Streak Achievements"
                : "Conquistas de Sequência"}
            </h4>
            <div className="space-y-2">
              {[
                {
                  days: 3,
                  label: locale === "en" ? "Getting Started" : "Começando",
                },
                {
                  days: 7,
                  label:
                    locale === "en" ? "Week Warrior" : "Guerreiro da Semana",
                },
                {
                  days: 30,
                  label: locale === "en" ? "Monthly Master" : "Mestre Mensal",
                },
                {
                  days: 90,
                  label:
                    locale === "en"
                      ? "Quarterly Champion"
                      : "Campeão Trimestral",
                },
              ].map((achievement) => (
                <div
                  key={achievement.days}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        streakData.longestStreak >= achievement.days
                          ? "bg-green-500"
                          : "bg-slate-300"
                      }`}
                    />
                    <span className="text-sm">{achievement.label}</span>
                  </div>
                  <span
                    className={`text-xs ${
                      streakData.longestStreak >= achievement.days
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-slate-500"
                    }`}
                  >
                    {achievement.days} {locale === "en" ? "days" : "dias"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
