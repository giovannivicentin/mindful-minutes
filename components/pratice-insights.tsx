"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Clock, Zap, Award, Calendar } from "lucide-react";

interface PracticeInsightsProps {
  locale: string;
}

interface WeeklyData {
  week: string;
  minutes: number;
  sessions: number;
}

export function PracticeInsights({ locale }: PracticeInsightsProps) {
  const t = useTranslation(locale);
  const { sessions } = useStore();
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [favoriteTime, setFavoriteTime] = useState<string>("");
  const [favoritePractice, setFavoritePractice] = useState<string>("");

  useEffect(() => {
    // Calculate weekly data for the past 4 weeks
    const calculateWeeklyData = () => {
      const weeks: WeeklyData[] = [];
      const today = new Date();

      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - i * 7 - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekSessions = sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });

        const totalMinutes = weekSessions.reduce(
          (sum, session) => sum + session.duration,
          0
        );

        weeks.push({
          week: weekStart.toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
          }),
          minutes: totalMinutes,
          sessions: weekSessions.length,
        });
      }

      setWeeklyData(weeks);
    };

    // Calculate favorite practice time
    const calculateFavoriteTime = () => {
      const timeSlots = new Map<string, number>();

      sessions.forEach((session) => {
        const hour = new Date(session.date).getHours();
        let timeSlot = "";

        if (hour >= 5 && hour < 12)
          timeSlot = locale === "en" ? "Morning" : "Manhã";
        else if (hour >= 12 && hour < 17)
          timeSlot = locale === "en" ? "Afternoon" : "Tarde";
        else if (hour >= 17 && hour < 21)
          timeSlot = locale === "en" ? "Evening" : "Noite";
        else timeSlot = locale === "en" ? "Night" : "Madrugada";

        timeSlots.set(timeSlot, (timeSlots.get(timeSlot) || 0) + 1);
      });

      let maxCount = 0;
      let favoriteSlot = "";
      timeSlots.forEach((count, slot) => {
        if (count > maxCount) {
          maxCount = count;
          favoriteSlot = slot;
        }
      });

      setFavoriteTime(favoriteSlot);
    };

    // Calculate favorite practice
    const calculateFavoritePractice = () => {
      const practices = new Map<string, number>();

      sessions.forEach((session) => {
        practices.set(
          session.practice,
          (practices.get(session.practice) || 0) + 1
        );
      });

      let maxCount = 0;
      let favorite = "";
      practices.forEach((count, practice) => {
        if (count > maxCount) {
          maxCount = count;
          favorite = practice;
        }
      });

      setFavoritePractice(favorite);
    };

    calculateWeeklyData();
    calculateFavoriteTime();
    calculateFavoritePractice();
  }, [sessions, locale]);

  const totalMinutes = sessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const averageSession =
    sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
  const thisWeekMinutes = weeklyData[3]?.minutes || 0;
  const lastWeekMinutes = weeklyData[2]?.minutes || 0;
  const weeklyGrowth =
    lastWeekMinutes > 0
      ? ((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100
      : 0;

  // Calculate consistency score (percentage of days with practice in last 30 days)
  const calculateConsistency = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = sessions.filter(
      (session) => new Date(session.date) >= thirtyDaysAgo
    );
    const uniqueDays = new Set(
      recentSessions.map(
        (session) => new Date(session.date).toISOString().split("T")[0]
      )
    );

    return Math.round((uniqueDays.size / 30) * 100);
  };

  const consistencyScore = calculateConsistency();

  const getPracticeDisplayName = (practice: string) => {
    switch (practice) {
      case "breathing":
        return t("practices.breathing.title");
      case "meditation":
        return t("practices.meditation.title");
      case "tratak":
        return t("practices.tratak.title");
      case "muscle-relaxation":
        return t("practices.muscle-relaxation.title");
      default:
        return practice;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Weekly Progress */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {locale === "en" ? "Weekly Progress" : "Progresso Semanal"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {weeklyData.map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    {week.week}
                  </span>
                  <span className="font-medium">{week.minutes}m</span>
                </div>
                <Progress
                  value={
                    (week.minutes /
                      Math.max(...weeklyData.map((w) => w.minutes), 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>
            ))}
          </div>
          {weeklyGrowth !== 0 && (
            <div
              className={`flex items-center gap-2 text-sm ${
                weeklyGrowth > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${weeklyGrowth < 0 ? "rotate-180" : ""}`}
              />
              <span>
                {Math.abs(weeklyGrowth).toFixed(1)}%{" "}
                {locale === "en" ? "vs last week" : "vs semana passada"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consistency Score */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {locale === "en" ? "Consistency" : "Consistência"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {consistencyScore}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {locale === "en"
                ? "Practice days in last 30 days"
                : "Dias de prática nos últimos 30 dias"}
            </div>
          </div>
          <Progress value={consistencyScore} className="h-3" />
          <div className="text-xs text-center text-slate-500 dark:text-slate-400">
            {locale === "en"
              ? `${Math.round((consistencyScore * 30) / 100)} out of 30 days`
              : `${Math.round((consistencyScore * 30) / 100)} de 30 dias`}
          </div>
        </CardContent>
      </Card>

      {/* Average Session */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-full">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {locale === "en" ? "Average Session" : "Sessão Média"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-3xl font-bold text-purple-500">
            {averageSession}m
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {locale === "en"
              ? "Average practice duration"
              : "Duração média da prática"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {locale === "en"
              ? `Based on ${sessions.length} sessions`
              : `Baseado em ${sessions.length} sessões`}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Time */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Zap className="h-5 w-5 text-orange-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {locale === "en" ? "Peak Time" : "Horário Preferido"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-2xl font-bold text-orange-500">
            {favoriteTime}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {locale === "en"
              ? "Most active practice time"
              : "Horário mais ativo de prática"}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Practice */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-full">
              <Award className="h-5 w-5 text-pink-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {locale === "en" ? "Favorite Practice" : "Prática Favorita"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-lg font-bold text-pink-500">
            {favoritePractice ? getPracticeDisplayName(favoritePractice) : "-"}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {locale === "en"
              ? "Most practiced activity"
              : "Atividade mais praticada"}
          </div>
        </CardContent>
      </Card>

      {/* Total Practice Time */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-full">
              <Calendar className="h-5 w-5 text-indigo-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {locale === "en" ? "Total Practice" : "Prática Total"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-3xl font-bold text-indigo-500">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {locale === "en"
              ? "Lifetime practice time"
              : "Tempo total de prática"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {locale === "en"
              ? `${sessions.length} sessions completed`
              : `${sessions.length} sessões completadas`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
