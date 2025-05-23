import { PracticeGrid } from "@/components/practice-grid";
import { useTranslation } from "@/hooks/use-translation";

export default function PracticesPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslation(params.locale);

  return (
    <div className="container py-20">
      <PracticeGrid locale={params.locale} />
    </div>
  );
}
