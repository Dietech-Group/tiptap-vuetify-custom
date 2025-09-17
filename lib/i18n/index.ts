import cs from "./cs";
import de from "./de";
import el from "./el";
import en from "./en";
import es from "./es";
import fa from "./fa";
import fi from "./fi";
import fr from "./fr";
import he from "./he";
import it from "./it";
import ja from "./ja";
import ko from "./ko";
import nl from "./nl";
import pl from "./pl";
import ptbr from "./ptbr";
import ru from "./ru";
import sk from "./sk";
import sv from "./sv";
import tr from "./tr";
import uk from "./uk";
import zh from "./zh";

import TiptapVuetifyPlugin from "@/TiptapVuetifyPlugin";
import ConsoleLogger from "@/logging/ConsoleLogger";

export const defaultLanguage = "en";

export const dictionary: Record<string, any> = {
  en,
  ru,
  es,
  pl,
  fr,
  uk,
  ptbr,
  tr,
  he,
  nl,
  ja,
  de,
  ko,
  zh,
  zhHans: zh,
  fa,
  sv,
  cs,
  it,
  el,
  sk,
  fi,
};

/**
 * Get current language of the TiptapVuetifyPlugin (defined by vuetify)
 * @returns Language code.
 */
export function getCurrentLang() {
  return TiptapVuetifyPlugin.vuetifyLang || defaultLanguage;
}

/**
 * Localize message
 * @param path - The path of the message.
 * @param args - Arguments which will be used during localization.
 * @param lang - Language.
 * @returns The localized message.
 */
export function getMsg(
  path: string,
  args?: any,
  lang: string | null = null,
): string {
  let currentLang: string | null = lang ?? getCurrentLang();

  if (!dictionary[currentLang]) {
    ConsoleLogger.warn(
      `The current language "${currentLang}" is not yet available. Using language "${defaultLanguage}" by default. Contribution to github is welcome.`,
    );

    currentLang = defaultLanguage;
  }

  const dictionaryByLang = dictionary[currentLang];
  let target: any;

  try {
    target = path.split(".").reduce((prev: any, curr: string) => {
      return prev[curr];
    }, dictionaryByLang);
    // No error thrown by above reduce function if last stage is undefined - no fallback used and returned value is empty
    if (target === undefined) {
      throw new Error(`${path} is undefined.`);
    }
  } catch (e) {
    ConsoleLogger.warn(
      `Cannot get translation "${path}" for language "${currentLang}". Fallback "${defaultLanguage}" is used instead. Contribution to github is welcome.`,
    );

    // Использовать defaultLanguage если фраза не переведена на текущий язык
    return getMsg(path, args, defaultLanguage);
  }

  if (target instanceof Function) {
    return target(args);
  }

  return target;
}
