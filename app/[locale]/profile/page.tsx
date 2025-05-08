import { UserProgress } from "@/components/user-progress"
import { useTranslation } from "@/hooks/use-translation"

export default function ProfilePage({
  params,
}: {
  params: { locale: string }
}) {
  const t = useTranslation(params.locale)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>
      <UserProgress locale={params.locale} />
    </div>
  )
}
