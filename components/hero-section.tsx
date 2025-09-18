"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowRight, Play, Sparkles, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslation(locale);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="container relative px-4 md:py-8 md:px-6 z-10">
        <div className="flex flex-col items-center text-center space-y-12 max-w-5xl mx-auto pt-2 md:pt-4">
          {/* Logo and Badge - Fixed spacing issue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 mt-8 md:mt-0"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="p-2 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full"
              >
                <Leaf className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("home.hero.badge")}
              </span>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
                {t("home.hero.title")}
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              {t("home.hero.subtitle")}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            <Link href={`/${locale}/practices`}>
              <Button
                size="lg"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl text-lg font-medium"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="h-5 w-5" />
                  {t("home.hero.startButton")}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>

            <Link href={`/${locale}/practices`}>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl text-lg font-medium"
              >
                {t("home.hero.exploreButton")}
              </Button>
            </Link>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative w-full max-w-4xl mx-auto mt-16"
          ></motion.div>
        </div>
      </div>
    </section>
  );
}
