"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { ArrowRight, Brain, Heart, Mountain } from "lucide-react";

export function FeaturedPractices({ locale }: { locale: string }) {
  const t = useTranslation(locale);

  const featuredPractices = [
    {
      id: "breathing",
      icon: <Heart className="h-5 w-5" />,
      title: t("practices.breathing.title"),
      description: t("practices.breathing.description"),
      color: "from-rose-500/20 to-rose-500/5",
    },
    {
      id: "meditation",
      icon: <Brain className="h-5 w-5" />,
      title: t("practices.meditation.title"),
      description: t("practices.meditation.description"),
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      id: "visualization",
      icon: <Mountain className="h-5 w-5" />,
      title: t("practices.visualization.title"),
      description: t("practices.visualization.description"),
      color: "from-emerald-500/20 to-emerald-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredPractices.map((practice) => (
        <Card
          key={practice.id}
          className="overflow-hidden border-none shadow-md"
        >
          <div className={`h-3 bg-gradient-to-r ${practice.color}`} />
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {practice.icon}
              </div>
              <CardTitle>{practice.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              {practice.description}
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link
              href={`/${locale}/practices/${practice.id}`}
              className="w-full"
            >
              <Button variant="outline" className="w-full gap-2">
                {t("home.featured.tryButton")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
