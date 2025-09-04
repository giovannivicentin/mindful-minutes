"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

interface PracticeOverviewProps {
  locale: string;
}

type TimeSlotKey = "morning" | "afternoon" | "evening" | "night" | "";

interface PracticeStats {
  totalSessions: number;
  totalMinutes: number;
  averageSession: number;
  thisWeekSessions: number;
  lastWeekSessions: number;
  weeklyGrowth: number;
  favoritePractice: string;
  favoriteTime: TimeSlotKey;
  consistencyScore: number;
  activeDays: number;
}

export function PracticeOverview({ locale }: PracticeOverviewProps) {
  const t = useTranslation(locale);
  const { sessions } = useStore();
  const [stats, setStats] = useState<PracticeStats>({
    totalSessions: 0,
    totalMinutes: 0,
    averageSession: 0,
    thisWeekSessions: 0,
    lastWeekSessions: 0,
    weeklyGrowth: 0,
    favoritePractice: "",
    favoriteTime: "",
    consistencyScore: 0,
    activeDays: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      if (sessions.length === 0) {
        setStats({
          totalSessions: 0,
          totalMinutes: 0,
          averageSession: 0,
          thisWeekSessions: 0,
          lastWeekSessions: 0,
          weeklyGrowth: 0,
          favoritePractice: "",
          favoriteTime: "",
          consistencyScore: 0,
          activeDays: 0,
        });
        return;
      }

      const totalSessions = sessions.length;
      const totalMinutes = sessions.reduce(
        (sum, session) => sum + session.duration,
        0
      );
      const averageSession = Math.round(totalMinutes / totalSessions);

      // Weekly sessions
      const now = new Date();
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - now.getDay());
      thisWeekStart.setHours(0, 0, 0, 0);

      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);

      const thisWeekSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= thisWeekStart;
      }).length;

      const lastWeekSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= lastWeekStart && sessionDate < thisWeekStart;
      }).length;

      const weeklyGrowth =
        lastWeekSessions > 0
          ? ((thisWeekSessions - lastWeekSessions) / lastWeekSessions) * 100
          : 0;

      // Favorite practice
      const practiceCount = new Map<string, number>();
      sessions.forEach((session) => {
        practiceCount.set(
          session.practice,
          (practiceCount.get(session.practice) || 0) + 1
        );
      });

      let favoritePractice = "";
      let maxCount = 0;
      practiceCount.forEach((count, practice) => {
        if (count > maxCount) {
          maxCount = count;
          favoritePractice = practice;
        }
      });

      const timeSlots = new Map<Exclude<TimeSlotKey, "">, number>();
      sessions.forEach((session) => {
        const hour = new Date(session.date).getHours();
        let slot: Exclude<TimeSlotKey, "">;

        if (hour >= 5 && hour < 12) slot = "morning";
        else if (hour >= 12 && hour < 17) slot = "afternoon";
        else if (hour >= 17 && hour < 21) slot = "evening";
        else slot = "night";

        timeSlots.set(slot, (timeSlots.get(slot) || 0) + 1);
      });

      let favoriteTime: TimeSlotKey = "";
      let maxTimeCount = 0;
      timeSlots.forEach((count, slot) => {
        if (count > maxTimeCount) {
          maxTimeCount = count;
          favoriteTime = slot;
        }
      });

      // Consistency (last 30 days)
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
      const consistencyScore = Math.round((uniqueDays.size / 30) * 100);

      // Active days (all time)
      const allUniqueDays = new Set(
        sessions.map(
          (session) => new Date(session.date).toISOString().split("T")[0]
        )
      );
      const activeDays = allUniqueDays.size;

      setStats({
        totalSessions,
        totalMinutes,
        averageSession,
        thisWeekSessions,
        lastWeekSessions,
        weeklyGrowth,
        favoritePractice,
        favoriteTime,
        consistencyScore,
        activeDays,
      });
    };

    calculateStats();
  }, [sessions]);

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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Practice Time */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("profile.overview.totalPractice.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-3xl font-bold text-blue-500"
          >
            {formatTime(stats.totalMinutes)}
          </motion.div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {stats.totalSessions}{" "}
            {t("profile.overview.totalPractice.sessionsCompleted")}
          </div>
        </CardContent>
      </Card>

      {/* Average Session */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("profile.overview.averageSession.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.1 }}
            className="text-3xl font-bold text-green-500"
          >
            {stats.averageSession}m
          </motion.div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {t("profile.overview.averageSession.perSession")}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("profile.overview.thisWeek.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
              className="text-3xl font-bold text-purple-500"
            >
              {stats.thisWeekSessions}
            </motion.div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {t("profile.overview.thisWeek.sessionsLabel")}
            </div>
          </div>
          {stats.weeklyGrowth !== 0 && (
            <div
              className={`flex items-center justify-center gap-2 text-sm ${
                stats.weeklyGrowth > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${
                  stats.weeklyGrowth < 0 ? "rotate-180" : ""
                }`}
              />
              <span>
                {Math.abs(stats.weeklyGrowth).toFixed(1)}%{" "}
                {t("profile.overview.thisWeek.vsLastWeek")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consistency Score */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("profile.overview.consistency.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
              className="text-3xl font-bold text-orange-500"
            >
              {stats.consistencyScore}%
            </motion.div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {t("profile.overview.consistency.last30Days")}
            </div>
          </div>
          <Progress value={stats.consistencyScore} className="h-2" />
          <div className="text-xs text-center text-slate-500 dark:text-slate-400">
            {Math.round((stats.consistencyScore * 30) / 100)}{" "}
            {t("profile.overview.consistency.activeDaysLabel")}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Practice */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-full">
              <Activity className="h-5 w-5 text-pink-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("profile.overview.favoritePractice.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg font-bold text-pink-500"
          >
            {stats.favoritePractice
              ? getPracticeDisplayName(stats.favoritePractice)
              : "-"}
          </motion.div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {t("profile.overview.favoritePractice.mostPracticed")}
          </div>
        </CardContent>
      </Card>

      {/* Peak Time */}
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-full">
              <Zap className="h-5 w-5 text-indigo-500" />
            </div>
            <CardTitle className="text-lg font-semibold">
              {t("profile.overview.peakTime.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl font-bold text-indigo-500"
          >
            {stats.favoriteTime
              ? t(`profile.overview.timeSlots.${stats.favoriteTime}`)
              : "-"}
          </motion.div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {t("profile.overview.peakTime.mostActive")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
