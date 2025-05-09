import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowRight, Brain, Heart, Leaf } from "lucide-react";
import { FeaturedPractices } from "@/components/featured-practices";
import { BenefitsSection } from "@/components/benefits-section";

export default function HomePage({ params }: { params: { locale: string } }) {
  const t = useTranslation(params.locale);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <div className="p-4 bg-primary/20 rounded-full">
                <Leaf className="h-10 w-10 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              {t("home.hero.title")}
            </h1>

            <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
              {t("home.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href={`/${params.locale}/practices`}>
                <Button size="lg" className="gap-2">
                  {t("home.hero.startButton")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/${params.locale}/practices`}>
                <Button variant="outline" size="lg">
                  {t("home.hero.exploreButton")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <div className="w-24 h-24 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Practices */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-2">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter">
              {t("home.featured.title")}
            </h2>
            <p className="max-w-[700px] text-muted-foreground">
              {t("home.featured.subtitle")}
            </p>
          </div>

          <FeaturedPractices locale={params.locale} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <BenefitsSection locale={params.locale} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">
              {t("home.cta.title")}
            </h2>
            <p className="max-w-[600px] text-muted-foreground mb-6">
              {t("home.cta.subtitle")}
            </p>
            <Link href={`/${params.locale}/practices`}>
              <Button size="lg" className="gap-2">
                {t("home.cta.button")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
