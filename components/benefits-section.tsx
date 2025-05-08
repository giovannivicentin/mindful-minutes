"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Clock, Heart, Brain, Zap } from "lucide-react"

export function BenefitsSection({ locale }: { locale: string }) {
  const t = useTranslation(locale)

  const benefits = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: t("home.benefits.quick.title"),
      description: t("home.benefits.quick.description"),
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: t("home.benefits.stress.title"),
      description: t("home.benefits.stress.description"),
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: t("home.benefits.focus.title"),
      description: t("home.benefits.focus.description"),
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: t("home.benefits.energy.title"),
      description: t("home.benefits.energy.description"),
    },
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter">{t("home.benefits.title")}</h2>
        <p className="max-w-[700px] text-muted-foreground">{t("home.benefits.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-full bg-primary/10">{benefit.icon}</div>
            <h3 className="text-xl font-semibold">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
