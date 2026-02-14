import axios from "axios";
import type SourceProvider from "./SourceProvider";
import * as cheerio from "cheerio";
import type LangCodeRecord from "../langCodes/LangCodeRecord";
import { commonLangs } from "../langCodes/CommonLangs";

export default class Tatoeba implements SourceProvider {
  id: string;
  name: string;
  constructor() {
    this.id = "tatoeba";
    this.name = "Tatoeba";
  }

  async next(lang: string): Promise<string> {
    const localCode = langToLocalCode(lang);
    // https://tatoeba.org/en/sentences/random
    const endPoint = `https://tatoeba.org/en/sentences/random/${localCode}`;
    const res = await axios.get(endPoint);
    const data = res.data as TatoebaResponse;

    // console.log(data);
    return data.sentence.text;
  }
  async getAllLangs(): Promise<Array<LangCodeRecord>> {
    const commonLangCodes = commonLangs.map((el) => el.lang);
    const endPoint = `https://tatoeba.org/en`;
    const res = await axios.get(endPoint);
    // console.log(res);
    const data = cheerio.load(res.data);
    const languagesObject = JSON.parse(
      data("language-dropdown").attr("languages-json")!.toString(),
    );
    // {"abq":"Abaza","abk":"Abkhaz","ady":"Adyghe","afh":"Afrihili"}
    // console.log(languages);
    const languages: Array<LangCodeRecord> = Object.entries(languagesObject)
      .map((el) => {
        try {
          return {
            lang: localCodeToLang(el[0]),
            name: el[1] as string,
          };
        } catch {
          return null;
        }
      })
      .filter(
        (el) => el != null && commonLangCodes.includes(el.lang),
      ) as Array<LangCodeRecord>;
    return languages;
  }
}
function localCodeToLang(localCode: string): string {
  switch (localCode) {
    case "ara":
      return "ar";
    case "bul":
      return "bg";
    case "ces":
      return "cs";
    case "dan":
      return "da";
    case "deu":
      return "de";
    case "ell":
      return "el";
    case "eng":
      return "en";
    case "spa":
      return "es";
    case "est":
      return "et";
    case "fin":
      return "fi";
    case "fra":
      return "fr";
    case "heb":
      return "he";
    case "hun":
      return "hun";
    case "ind":
      return "id";
    case "ita":
      return "it";
    case "jpn":
      return "ja";
    case "kor":
      return "ko";
    case "lit":
      return "lt";
    case "lvs":
      return "lv";
    case "nob":
      return "nb";
    case "nld":
      return "nl";
    case "pol":
      return "pl";
    case "por":
      return "pt";
    case "ron":
      return "ro";
    case "rus":
      return "ru";
    case "slk":
      return "sk";
    case "slv":
      return "sl";
    case "swe":
      return "sv";
    case "tha":
      return "th";
    case "tur":
      return "tr";
    case "ukr":
      return "uk";
    case "vie":
      return "vi";
    case "cmn":
      return "zh";
    case "yue":
      return "yue";
    case "zsm":
      return "ms";
    default:
      throw new Error(`Not support: '${localCode}'`);
  }
}

function langToLocalCode(lang: string): string {
  switch (lang) {
    case "ar":
      return "ara";
    case "bg":
      return "bul";
    case "cs":
      return "ces";
    case "da":
      return "dan";
    case "de":
      return "deu";
    case "el":
      return "ell";
    case "en":
      return "eng";
    case "es":
      return "spa";
    case "et":
      return "est";
    case "fi":
      return "fin";
    case "fr":
      return "fra";
    case "he":
      return "heb";
    case "hu":
      return "hun";
    case "id":
      return "ind";
    case "it":
      return "ita";
    case "ja":
      return "jpn";
    case "ko":
      return "kor";
    case "lt":
      return "lit";
    case "lv":
      return "lvs";
    case "nb":
      return "nob";
    case "nl":
      return "nld";
    case "pl":
      return "pol";
    case "pt":
      return "por";
    case "ro":
      return "ron";
    case "ru":
      return "rus";
    case "sk":
      return "slk";
    case "sl":
      return "slv";
    case "sv":
      return "swe";
    case "th":
      return "tha";
    case "tr":
      return "tur";
    case "uk":
      return "ukr";
    case "vi":
      return "vie";
    case "zh":
      return "cmn";
    case "yue":
      return "yue";
    case "ms":
      return "zsm";
    default:
      throw new Error(`Not support: '${lang}'`);
  }
}

interface TatoebaResponse {
  sentence: {
    text: string;
    lang: string;
  };
}
