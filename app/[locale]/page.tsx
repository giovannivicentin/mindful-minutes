import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowRight, Leaf, Sparkles, Clock } from "lucide-react";
import { FeaturedPractices } from "@/components/featured-practices";
import { BenefitsSection } from "@/components/benefits-section";
import { HeroSection } from "@/components/hero-section";

export default function HomePage({ params }: { params: { locale: string } }) {
  const t = useTranslation(params.locale);
  const locale = params.locale;

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <HeroSection locale={params.locale} />

      {/* Featured Practices */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("home.hero.popularPractices")}
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                {t("home.featured.title")}
              </h2>
              <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("home.featured.subtitle")}
              </p>
            </div>
          </div>

          <FeaturedPractices locale={params.locale} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl" />

        <div className="container relative px-4 md:px-6">
          <BenefitsSection locale={params.locale} />
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/30 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container relative px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                <Leaf className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("home.hero.startJourney")}
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-light tracking-tight bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-slate-100 dark:via-primary dark:to-slate-100 bg-clip-text text-transparent">
                {t("home.cta.title")}
              </h2>

              <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("home.cta.subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href={`/${params.locale}/practices`}>
                <Button
                  size="lg"
                  className="group relative px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl text-lg font-medium"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {t("home.cta.button")}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span>{t("home.hero.sessionDuration")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
