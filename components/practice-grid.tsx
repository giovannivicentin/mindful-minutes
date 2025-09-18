"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { TreesIcon as Lungs, Eye, Activity, Leaf } from "lucide-react";

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
        style={{ backgroundImage: `url(${card.image})` }}
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
      {/* Practice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-8xl mx-auto">
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
    </div>
  );
}
