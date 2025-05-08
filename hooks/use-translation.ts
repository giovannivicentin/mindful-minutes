import { dictionaries } from "@/dictionaries"

export function useTranslation(locale: string) {
  const dictionary = dictionaries[locale as keyof typeof dictionaries] || dictionaries.en

  return function t(key: string, params?: Record<string, string>) {
    let translation = key.split(".").reduce((obj, key) => obj && obj[key], dictionary as any)

    if (!translation) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }

    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{{${param}}}`, params[param])
      })
    }

    return translation
  }
}
