"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { PracticeModule } from "@/components/practice-module";
import { useTranslation } from "@/hooks/use-translation";
import { notFound } from "next/navigation";
import { Leaf, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PracticePage({
  params,
}: {
  params: Promise<{ locale: string; practice: string }>;
}) {
  const { locale, practice } = use(params);
  const t = useTranslation(locale);
  const validPractices = [
    "breathing",
    "meditation",
    "tratak",
    "muscle-relaxation",
  ];

  if (!validPractices.includes(practice)) {
    notFound();
  }

  // Get practice-specific content
  const getPracticeInfo = () => {
    switch (practice) {
      case "breathing":
        return {
          title: t("practices.breathing.title"),
          description: t("practices.breathing.description"),
          gradient: "from-blue-500/20 via-cyan-500/15 to-teal-500/20",
          iconGradient: "from-blue-400/20 to-cyan-400/40",
        };
      case "meditation":
        return {
          title: t("practices.meditation.title"),
          description: t("practices.meditation.description"),
          gradient: "from-purple-500/20 via-indigo-500/15 to-blue-500/20",
          iconGradient: "from-purple-400/20 to-indigo-400/40",
        };
      case "tratak":
        return {
          title: t("practices.tratak.title"),
          description: t("practices.tratak.description"),
          gradient: "from-amber-500/20 via-orange-500/15 to-red-500/20",
          iconGradient: "from-amber-400/20 to-orange-400/40",
        };
      case "muscle-relaxation":
        return {
          title: t("practices.muscle-relaxation.title"),
          description: t("practices.muscle-relaxation.description"),
          gradient: "from-rose-500/20 via-pink-500/15 to-purple-500/20",
          iconGradient: "from-rose-400/20 to-pink-400/40",
        };
      default:
        return {
          title: "Practice",
          description: "Mindfulness practice",
          gradient: "from-primary/20 via-blue-500/15 to-purple-500/20",
          iconGradient: "from-primary/20 to-blue-400/40",
        };
    }
  };

  const practiceInfo = getPracticeInfo();

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
            className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${practiceInfo.gradient} rounded-full blur-3xl`}
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
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link href={`/${locale}/practices`}>
                <Button
                  variant="ghost"
                  className="group flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="text-sm font-medium">
                    {locale === "en" ? "All Practices" : "Todas as Práticas"}
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Header Content */}
            <div className="flex flex-col items-center text-center space-y-8 mb-12">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className={`p-2 bg-gradient-to-br ${practiceInfo.iconGradient} rounded-full`}
                >
                  <Leaf className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "en" ? "Mindful Practice" : "Prática Mindful"}
                </span>
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </motion.div>

              {/* Title and Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
                    {practiceInfo.title}
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  {practiceInfo.description}
                </p>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-white/20"
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulse delay-100"></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-200"></span>
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "en"
                    ? "Ready when you are"
                    : "Pronto quando você estiver"}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Module Section */}
      <section className="relative py-8 md:py-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl" />

        <div className="container relative px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <PracticeModule practice={practice} locale={locale} />
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
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {locale === "en" ? "Take your time" : "Vá no seu ritmo"}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-light tracking-tight bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
              {locale === "en"
                ? "Every moment of mindfulness counts"
                : "Cada momento de mindfulness conta"}
            </h3>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "en"
                ? "Remember, there's no perfect way to practice. Simply being here is already a step toward greater well-being."
                : "Lembre-se, não há uma maneira perfeita de praticar. Simplesmente estar aqui já é um passo em direção ao maior bem-estar."}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
