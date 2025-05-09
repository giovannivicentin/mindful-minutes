import { PracticeGrid } from "@/components/practice-grid";
import { useTranslation } from "@/hooks/use-translation";

export default function PracticesPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslation(params.locale);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t("practices.title")}</h1>
      <p className="text-muted-foreground mb-8">{t("practices.description")}</p>
      <PracticeGrid locale={params.locale} />
    </div>
  );
}
