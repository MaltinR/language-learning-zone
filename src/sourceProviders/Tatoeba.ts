import axios from "axios";
import type SourceProvider from "./SourceProvider";
import * as cheerio from "cheerio";
import type LocaleRecord from "../LocaleRecord";

export class Tatoeba implements SourceProvider {
  constructor() {}

  async next(locale: string): Promise<string> {
    // https://tatoeba.org/en/sentences/random
    const endPoint = `https://tatoeba.org/en/sentences/random/${locale}`;
    const res = await axios.get(endPoint);
    const data = res.data as TatoebaResponse;

    // console.log(data);
    return data.sentence.text;
  }
  async getAllLocales(): Promise<Array<LocaleRecord>> {
    const endPoint = `https://tatoeba.org/en`;
    const res = await axios.get(endPoint);
    // console.log(res);
    const data = cheerio.load(res.data);
    const languagesObject = JSON.parse(data("language-dropdown").attr("languages-json")!.toString());
    // {"abq":"Abaza","abk":"Abkhaz","ady":"Adyghe","afh":"Afrihili"}
    // console.log(languages);
    const languages : Array<LocaleRecord> = Object.entries(languagesObject).map(el => {
        return {
            locale: el[0],
            name: el[1] as string,
        };
    });
    return languages;
  }
}

interface TatoebaResponse {
  sentence: {
    text: string;
    lang: string;
  };
}
