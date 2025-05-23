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
    "tratak",
    "muscle-relaxation",
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
