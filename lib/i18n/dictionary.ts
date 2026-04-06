import "server-only";

import enDict from "@/dictionaries/en.json";

export type Dictionary = typeof enDict;

export type Locale = "en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export async function getDictionary(locale: Locale = "en"): Promise<Dictionary> {
  return dictionaries[locale]();
}

/**
 * Synchronous accessor for server components in the current single-locale setup.
 * When locale routing is added, replace with the async `getDictionary`.
 */
export function dict(): Dictionary {
  return enDict;
}
