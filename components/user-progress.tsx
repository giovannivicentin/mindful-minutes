"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/use-translation";
import { useStore } from "@/lib/store";
import { Flame, Clock, Calendar, Award } from "lucide-react";

interface UserProgressProps {
  locale: string;
}

export function UserProgress({ locale }: UserProgressProps) {
  const t = useTranslation(locale);
  const { sessions } = useStore();
  const [streak, setStreak] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    // Calculate stats from sessions
    setTotalSessions(sessions.length);

    const minutes = sessions.reduce(
      (total, session) => total + session.duration,
      0
    );
    setTotalMinutes(minutes);

    // Calculate streak (simplified version)
    const calculateStreak = () => {
      if (sessions.length === 0) return 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Check if there's a session today
      const hasSessionToday = sessions.some((session) => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime();
      });

      // Check if there's a session yesterday
      const hasSessionYesterday = sessions.some((session) => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === yesterday.getTime();
      });

      // Simple streak calculation (in a real app, this would be more sophisticated)
      if (hasSessionToday) {
        return hasSessionYesterday ? 2 : 1;
      }

      return 0;
    };

    setStreak(calculateStreak());
  }, [sessions]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours} ${t("profile.hours")} ${mins} ${t("profile.minutes")}`;
    }

    return `${mins} ${t("profile.minutes")}`;
  };

  // Calculate badge progress
  const streakProgress = Math.min((streak / 7) * 100, 100);
  const hoursProgress = Math.min((totalMinutes / 600) * 100, 100); // 600 minutes = 10 hours

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("profile.streak")}
          </CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {streak} {t("profile.days")}
          </div>
          <Progress value={streakProgress} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("profile.totalTime")}
          </CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(totalMinutes)}</div>
          <Progress value={hoursProgress} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("profile.sessions")}
          </CardTitle>
          <Calendar className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("profile.badges.title")}
          </CardTitle>
          <Award className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("profile.badges.streak7")}</span>
              <span
                className={`text-xs ${
                  streak >= 7 ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                {streak >= 7 ? "✓" : `${streak}/7`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("profile.badges.hours10")}</span>
              <span
                className={`text-xs ${
                  totalMinutes >= 600
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              >
                {totalMinutes >= 600
                  ? "✓"
                  : `${Math.floor(totalMinutes / 60)}/10`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
