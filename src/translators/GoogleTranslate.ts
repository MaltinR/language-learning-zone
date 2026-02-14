import axios from "axios";
import type LangCodeRecord from "../langCodes/LangCodeRecord";
import type Translator from "./Translator";
import { commonLangs } from "../langCodes/CommonLangs";
import localCodeNames, {
  localCodeLangMapping,
} from "./googleTranslateLocalCodeNames";

export default class GoogleTranslate implements Translator {
  name: string;
  id: string;

  constructor() {
    this.name = "Google Translate";
    this.id = "google_translate";
  }

  async translate(
    text: string,
    fromLang: string,
    toLang: string,
  ): Promise<string> {
    const apiKey = process.env.GOOGLE_TRANSLATE_KEY;
    const endPoint = "https://translation.googleapis.com/language/translate/v2";

    const localFromLang = langToLocalCode(fromLang);
    const localToLang = langToLocalCode(toLang);

    const body = {
      q: text,
      source: localFromLang,
      target: localToLang,
      format: "text",
    };

    try {
      const res = await axios.post(endPoint, body, {
        headers: {
          "x-goog-api-key": apiKey,
        },
      });

      const data: GoogleTranslateTranslateResponse = res.data;
      console.log(data);
      return data.data.translations[0]!.translatedText;
    } catch (e: any) {
    //   console.error(e);
      console.log(JSON.stringify(body));
      throw e;
    }
  }

  getAllFromLangs(): Promise<Array<LangCodeRecord>> {
    return getAllLangs();
  }

  getAllToLangs(): Promise<Array<LangCodeRecord>> {
    return getAllLangs();
  }
}

async function getAllLangs(): Promise<Array<LangCodeRecord>> {
  const commonLangCodes = commonLangs.map((el) => el.lang);

  const apiKey = process.env.GOOGLE_TRANSLATE_KEY;
  const endPoint =
    "https://translation.googleapis.com/language/translate/v2/languages";

  const res = await axios.get(endPoint, {
    headers: {
      "x-goog-api-key": apiKey,
    },
  });

  const data: GoogleTranslateLanguagesResponse = res.data;

  const languages: Array<LangCodeRecord> = data.data.languages
    .map((el) => {
      const localCodeName = localCodeNames.find(
        (item) => item.localCode === el.language,
      );
      if (localCodeName == null) return null;

      return {
        lang: localCodeToLang(localCodeName.localCode),
        name: localCodeName.name,
      };
    })
    .filter(
      (el) => el != null && commonLangCodes.includes(el.lang),
    ) as Array<LangCodeRecord>;

  return languages;
}

function langToLocalCode(lang: string): string {
  const localCodeLang = localCodeLangMapping.find((el) => el.lang === lang);
  if (localCodeLang != null) return localCodeLang.localCode;

  return lang;
}

function localCodeToLang(localCode: string): string {
  const localCodeLang = localCodeLangMapping.find(
    (el) => el.localCode === localCode,
  );
  if (localCodeLang != null) return localCodeLang.lang;

  return localCode;
}

interface GoogleTranslateTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
}

interface GoogleTranslateLanguagesResponse {
  data: {
    languages: Array<{
      language: string;
    }>;
  };
}
