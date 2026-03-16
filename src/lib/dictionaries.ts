import type { Locale } from "./i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = Record<string, any>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  sq: () => import("@/dictionaries/sq.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  it: () => import("@/dictionaries/it.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale];
  if (!loader) {
    throw new Error(`No dictionary found for locale "${locale}"`);
  }
  return loader();
}
