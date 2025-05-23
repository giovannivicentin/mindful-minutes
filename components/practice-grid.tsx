"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { TreesIcon as Lungs, Brain, Eye, Activity, Leaf } from "lucide-react";

interface PracticeCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  gradient: string;
}

const PracticeCardComponent = ({
  card,
  index,
  hovered,
  setHovered,
  locale,
}: {
  card: PracticeCard;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  locale: string;
}) => (
  <Link href={`/${locale}/practices/${card.id}`} className="block">
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-xl relative overflow-hidden h-96 w-full transition-all duration-500 ease-out cursor-pointer group",
        "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-800",
        hovered !== null &&
          hovered !== index &&
          "blur-sm scale-[0.96] opacity-70"
      )}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${card.image})`,
        }}
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          card.gradient
        )}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-8">
        {/* Icon */}
        <div className="flex justify-end">
          <div
            className={cn(
              "p-4 rounded-full backdrop-blur-sm transition-all duration-300",
              "bg-white/20 border border-white/30",
              hovered === index ? "bg-white/30 scale-110" : ""
            )}
          >
            <div className="text-white text-2xl">{card.icon}</div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold transition-all duration-300",
              "bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90",
              hovered === index ? "translate-y-0" : "translate-y-2"
            )}
          >
            {card.title}
          </h3>
          <p
            className={cn(
              "text-white/90 text-base md:text-lg transition-all duration-500 delay-100 leading-relaxed",
              hovered === index
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            {card.description}
          </p>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl border-2 transition-all duration-300",
          hovered === index
            ? "border-white/50 shadow-2xl shadow-white/20"
            : "border-transparent"
        )}
      />

      {/* Subtle shine effect on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
          "transform -skew-x-12 transition-transform duration-700",
          hovered === index ? "translate-x-full" : "-translate-x-full"
        )}
      />
    </div>
  </Link>
);

export function PracticeGrid({ locale }: { locale: string }) {
  const t = useTranslation(locale);
  const [hovered, setHovered] = useState<number | null>(null);

  const practices: PracticeCard[] = [
    {
      id: "breathing",
      icon: <Lungs className="h-7 w-7" />,
      title: t("practices.breathing.title"),
      description: t("practices.breathing.description"),
      image: "/pratices/guided-breathing.png",
      gradient:
        "bg-gradient-to-br from-blue-500/80 via-cyan-500/70 to-teal-500/80",
    },
    {
      id: "meditation",
      icon: <Brain className="h-7 w-7" />,
      title: t("practices.meditation.title"),
      description: t("practices.meditation.description"),
      image: "/pratices/meditation.png",
      gradient:
        "bg-gradient-to-br from-purple-500/80 via-indigo-500/70 to-blue-500/80",
    },
    {
      id: "tratak",
      icon: <Eye className="h-7 w-7" />,
      title: t("practices.tratak.title"),
      description: t("practices.tratak.description"),
      image: "/pratices/tratak.png",
      gradient:
        "bg-gradient-to-br from-amber-500/80 via-orange-500/70 to-red-500/80",
    },
    {
      id: "muscle-relaxation",
      icon: <Activity className="h-7 w-7" />,
      title: t("practices.muscle-relaxation.title"),
      description: t("practices.muscle-relaxation.description"),
      image: "/pratices/muscle-relaxation.png",
      gradient:
        "bg-gradient-to-br from-rose-500/80 via-pink-500/70 to-purple-500/80",
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-16">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
            <div className="p-4 bg-primary/20 rounded-full">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            {t("practices.title")}
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            {t("practices.description")}
          </p>
        </div>
      </div>

      {/* Practice Cards Grid - Optimized for 4 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-8xl mx-auto">
        {practices.map((practice, index) => (
          <PracticeCardComponent
            key={practice.id}
            card={practice}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            locale={locale}
          />
        ))}
      </div>

      {/* Enhanced Call to Action */}
      <div className="text-center mt-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="text-muted-foreground text-lg leading-relaxed">
            {locale === "en"
              ? "Each practice is designed to help you find calm, reduce stress, and improve your mental well-being in just minutes."
              : "Cada prática é projetada para ajudá-lo a encontrar calma, reduzir o estresse e melhorar seu bem-estar mental em apenas alguns minutos."}
          </p>
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="w-2 h-2 bg-primary/70 rounded-full animate-pulse delay-100"></span>
              <span className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-200"></span>
            </div>
            <span className="text-primary font-semibold text-lg">
              {locale === "en"
                ? "Choose your practice to begin"
                : "Escolha sua prática para começar"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
