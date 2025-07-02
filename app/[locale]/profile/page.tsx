"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { StreakDisplay } from "@/components/streak-display";
import { Leaf, Sparkles, User, TrendingUp, Target } from "lucide-react";
import { AchievementBadges } from "@/components/achivement-badget";
import { PracticeOverview } from "@/components/pratice-overview";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslation(locale);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container relative px-4 md:px-6 z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header Content */}
            <div className="flex flex-col items-center text-center space-y-8 mb-12">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="p-2 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full"
                >
                  <Leaf className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "en"
                    ? "Your Mindfulness Journey"
                    : "Sua Jornada de Mindfulness"}
                </span>
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </motion.div>

              {/* Title and Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
                    {t("profile.title")}
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  {locale === "en"
                    ? "Track your consistency, celebrate achievements, and discover insights about your mindfulness practice."
                    : "Acompanhe sua consistência, celebre conquistas e descubra insights sobre sua prática de mindfulness."}
                </p>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-8 text-center"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {locale === "en" ? "Personal Dashboard" : "Painel Pessoal"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {locale === "en"
                      ? "Streak Tracking"
                      : "Acompanhamento de Sequência"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {locale === "en"
                      ? "Progress Insights"
                      : "Insights de Progresso"}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-8 md:py-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl" />

        <div className="container relative px-4 md:px-6 space-y-12">
          {/* Streak Display */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <StreakDisplay locale={locale} />
          </motion.div>

          {/* Practice Overview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PracticeOverview locale={locale} />
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AchievementBadges locale={locale} />
          </motion.div>
        </div>
      </section>

      {/* Bottom Encouragement Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/30 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-full blur-3xl animate-pulse" />

        <div className="container relative px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {locale === "en"
                  ? "Keep building your streak"
                  : "Continue construindo sua sequência"}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-light tracking-tight bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
              {locale === "en"
                ? "Consistency creates transformation"
                : "Consistência cria transformação"}
            </h3>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "en"
                ? "Every practice session builds momentum. Your dedication to mindfulness is creating lasting positive change in your life."
                : "Cada sessão de prática constrói momentum. Sua dedicação ao mindfulness está criando mudanças positivas duradouras em sua vida."}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
