"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { PracticeGrid } from "@/components/practice-grid";
import { Leaf, Sparkles, Clock, Heart } from "lucide-react";

export default function PracticesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslation(locale);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
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
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute top-3/4 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container relative px-4 md:px-6 z-10">
          <div className="flex flex-col items-center text-center space-y-12 max-w-5xl mx-auto">
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
                  ? "Choose Your Practice"
                  : "Escolha Sua Prática"}
              </span>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
                  {t("practices.title")}
                </span>
              </h1>

              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {t("practices.description")}
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
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "en" ? "7-21 minutes" : "7-21 minutos"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "en" ? "Science-backed" : "Baseado em ciência"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "en" ? "Instant relief" : "Alívio instantâneo"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Practice Grid - Integrated within the hero section */}
        <div className="container relative px-4 md:px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <PracticeGrid locale={locale} />
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/30 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container relative px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                <Leaf className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "en"
                    ? "Start your wellness journey"
                    : "Comece sua jornada de bem-estar"}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-light tracking-tight bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
                {locale === "en"
                  ? "Ready to find your calm?"
                  : "Pronto para encontrar sua calma?"}
              </h2>

              <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {locale === "en"
                  ? "Each practice is designed to help you reduce stress, improve focus, and enhance your overall well-being in just minutes."
                  : "Cada prática é projetada para ajudá-lo a reduzir o estresse, melhorar o foco e aprimorar seu bem-estar geral em apenas alguns minutos."}
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulse delay-100"></span>
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-200"></span>
              </div>
              <span className="text-primary font-semibold text-lg">
                {locale === "en"
                  ? "Choose a practice above to begin"
                  : "Escolha uma prática acima para começar"}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
