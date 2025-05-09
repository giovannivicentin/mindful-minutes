import { PracticeModule } from "@/components/practice-module";
import { useTranslation } from "@/hooks/use-translation";
import { notFound } from "next/navigation";

export default function PracticePage({
  params,
}: {
  params: { locale: string; practice: string };
}) {
  const t = useTranslation(params.locale);
  const validPractices = [
    "breathing",
    "meditation",
    "visualization",
    "tratak",
    "muscle-relaxation",
    "cognitive-restructuring",
    "hrv-biofeedback",
    "combo",
  ];

  if (!validPractices.includes(params.practice)) {
    notFound();
  }

  return (
    <div className="container py-8">
      <PracticeModule practice={params.practice} locale={params.locale} />
    </div>
  );
}
