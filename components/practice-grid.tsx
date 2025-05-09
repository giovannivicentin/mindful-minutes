"use client";

import type React from "react";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import {
  TreesIcon as Lungs,
  Brain,
  Mountain,
  Eye,
  Activity,
  FileText,
  Heart,
  ListChecks,
} from "lucide-react";

interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function PracticeCard({ title, description, icon, href }: PracticeCardProps) {
  return (
    <Link href={href} className="block transition-all hover:scale-[1.02]">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {icon}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PracticeGrid({ locale }: { locale: string }) {
  const t = useTranslation(locale);

  const practices = [
    {
      id: "breathing",
      icon: <Lungs className="h-5 w-5" />,
      title: t("practices.breathing.title"),
      description: t("practices.breathing.description"),
    },
    {
      id: "meditation",
      icon: <Brain className="h-5 w-5" />,
      title: t("practices.meditation.title"),
      description: t("practices.meditation.description"),
    },
    {
      id: "visualization",
      icon: <Mountain className="h-5 w-5" />,
      title: t("practices.visualization.title"),
      description: t("practices.visualization.description"),
    },
    {
      id: "tratak",
      icon: <Eye className="h-5 w-5" />,
      title: t("practices.tratak.title"),
      description: t("practices.tratak.description"),
    },
    {
      id: "muscle-relaxation",
      icon: <Activity className="h-5 w-5" />,
      title: t("practices.muscle-relaxation.title"),
      description: t("practices.muscle-relaxation.description"),
    },
    {
      id: "cognitive-restructuring",
      icon: <FileText className="h-5 w-5" />,
      title: t("practices.cognitive-restructuring.title"),
      description: t("practices.cognitive-restructuring.description"),
    },
    {
      id: "hrv-biofeedback",
      icon: <Heart className="h-5 w-5" />,
      title: t("practices.hrv-biofeedback.title"),
      description: t("practices.hrv-biofeedback.description"),
    },
    {
      id: "combo",
      icon: <ListChecks className="h-5 w-5" />,
      title: t("practices.combo.title"),
      description: t("practices.combo.description"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {practices.map((practice) => (
        <PracticeCard
          key={practice.id}
          title={practice.title}
          description={practice.description}
          icon={practice.icon}
          href={`/${locale}/practices/${practice.id}`}
        />
      ))}
    </div>
  );
}
