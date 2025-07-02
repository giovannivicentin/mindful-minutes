"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Clock,
  Calendar,
  Award,
  Target,
  Zap,
  Star,
  Trophy,
} from "lucide-react";

interface AchievementBadgesProps {
  locale: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  target?: number;
  color: string;
}

export function AchievementBadges({ locale }: AchievementBadgesProps) {
  const t = useTranslation(locale);
  const { sessions } = useStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const calculateAchievements = () => {
      const totalMinutes = sessions.reduce(
        (sum, session) => sum + session.duration,
        0
      );
      const totalSessions = sessions.length;

      // Calculate current streak
      const calculateStreak = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streak = 0;

        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateKey = checkDate.toISOString().split("T")[0];

          const hasSession = sessions.some((session) => {
            const sessionDate = new Date(session.date);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate.toISOString().split("T")[0] === dateKey;
          });

          if (hasSession) {
            streak++;
          } else if (i > 0) {
            // Allow for today to not have a session yet
            break;
          }
        }

        return streak;
      };

      const currentStreak = calculateStreak();

      // Check unique practices
      const uniquePractices = new Set(
        sessions.map((session) => session.practice)
      );

      // Check consistency (days with practice in last 30 days)
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
      const consistencyDays = uniqueDays.size;

      const achievementList: Achievement[] = [
        {
          id: "first-session",
          title: locale === "en" ? "First Steps" : "Primeiros Passos",
          description:
            locale === "en"
              ? "Complete your first practice session"
              : "Complete sua primeira sessão de prática",
          icon: <Star className="h-5 w-5" />,
          earned: totalSessions >= 1,
          color: "bg-yellow-500",
        },
        {
          id: "streak-3",
          title: locale === "en" ? "Getting Started" : "Começando",
          description:
            locale === "en"
              ? "Practice for 3 days in a row"
              : "Pratique por 3 dias seguidos",
          icon: <Flame className="h-5 w-5" />,
          earned: currentStreak >= 3,
          progress: Math.min(currentStreak, 3),
          target: 3,
          color: "bg-orange-500",
        },
        {
          id: "streak-7",
          title: locale === "en" ? "Week Warrior" : "Guerreiro da Semana",
          description:
            locale === "en"
              ? "Practice for 7 days in a row"
              : "Pratique por 7 dias seguidos",
          icon: <Flame className="h-5 w-5" />,
          earned: currentStreak >= 7,
          progress: Math.min(currentStreak, 7),
          target: 7,
          color: "bg-red-500",
        },
        {
          id: "streak-30",
          title: locale === "en" ? "Monthly Master" : "Mestre Mensal",
          description:
            locale === "en"
              ? "Practice for 30 days in a row"
              : "Pratique por 30 dias seguidos",
          icon: <Trophy className="h-5 w-5" />,
          earned: currentStreak >= 30,
          progress: Math.min(currentStreak, 30),
          target: 30,
          color: "bg-purple-500",
        },
        {
          id: "time-60",
          title: locale === "en" ? "Hour Hero" : "Herói da Hora",
          description:
            locale === "en"
              ? "Practice for 1 hour total"
              : "Pratique por 1 hora no total",
          icon: <Clock className="h-5 w-5" />,
          earned: totalMinutes >= 60,
          progress: Math.min(totalMinutes, 60),
          target: 60,
          color: "bg-blue-500",
        },
        {
          id: "time-600",
          title: locale === "en" ? "Time Master" : "Mestre do Tempo",
          description:
            locale === "en"
              ? "Practice for 10 hours total"
              : "Pratique por 10 horas no total",
          icon: <Clock className="h-5 w-5" />,
          earned: totalMinutes >= 600,
          progress: Math.min(totalMinutes, 600),
          target: 600,
          color: "bg-indigo-500",
        },
        {
          id: "sessions-10",
          title:
            locale === "en" ? "Dedicated Practitioner" : "Praticante Dedicado",
          description:
            locale === "en"
              ? "Complete 10 practice sessions"
              : "Complete 10 sessões de prática",
          icon: <Target className="h-5 w-5" />,
          earned: totalSessions >= 10,
          progress: Math.min(totalSessions, 10),
          target: 10,
          color: "bg-green-500",
        },
        {
          id: "sessions-50",
          title: locale === "en" ? "Practice Pro" : "Profissional da Prática",
          description:
            locale === "en"
              ? "Complete 50 practice sessions"
              : "Complete 50 sessões de prática",
          icon: <Award className="h-5 w-5" />,
          earned: totalSessions >= 50,
          progress: Math.min(totalSessions, 50),
          target: 50,
          color: "bg-emerald-500",
        },
        {
          id: "all-practices",
          title: locale === "en" ? "Explorer" : "Explorador",
          description:
            locale === "en"
              ? "Try all practice types"
              : "Experimente todos os tipos de prática",
          icon: <Zap className="h-5 w-5" />,
          earned: uniquePractices.size >= 4,
          progress: uniquePractices.size,
          target: 4,
          color: "bg-pink-500",
        },
        {
          id: "consistent",
          title:
            locale === "en"
              ? "Consistency Champion"
              : "Campeão da Consistência",
          description:
            locale === "en"
              ? "Practice 20 days in the last month"
              : "Pratique 20 dias no último mês",
          icon: <Calendar className="h-5 w-5" />,
          earned: consistencyDays >= 20,
          progress: Math.min(consistencyDays, 20),
          target: 20,
          color: "bg-teal-500",
        },
      ];

      setAchievements(achievementList);
    };

    calculateAchievements();
  }, [sessions, locale]);

  const earnedAchievements = achievements.filter((a) => a.earned);
  const inProgressAchievements = achievements.filter(
    (a) => !a.earned && a.progress !== undefined
  );
  const lockedAchievements = achievements.filter(
    (a) => !a.earned && a.progress === undefined
  );

  return (
    <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-full">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {locale === "en" ? "Achievements" : "Conquistas"}
          </CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {earnedAchievements.length}/{achievements.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">
              {locale === "en" ? "Earned" : "Conquistadas"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {earnedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-800/50"
                >
                  <div
                    className={`p-2 ${achievement.color} text-white rounded-full`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {achievement.description}
                    </div>
                  </div>
                  <div className="text-green-500">
                    <Award className="h-4 w-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* In Progress Achievements */}
        {inProgressAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">
              {locale === "en" ? "In Progress" : "Em Progresso"}
            </h4>
            <div className="space-y-3">
              {inProgressAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div
                    className={`p-2 ${achievement.color} text-white rounded-full opacity-70`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate mb-2">
                      {achievement.description}
                    </div>
                    {achievement.progress !== undefined &&
                      achievement.target && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">
                              {achievement.progress}/{achievement.target}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {Math.round(
                                (achievement.progress / achievement.target) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${achievement.color}`}
                              style={{
                                width: `${
                                  (achievement.progress / achievement.target) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">
              {locale === "en" ? "Locked" : "Bloqueadas"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700 opacity-60"
                >
                  <div className="p-2 bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-full">
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-600 dark:text-slate-400 truncate">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
