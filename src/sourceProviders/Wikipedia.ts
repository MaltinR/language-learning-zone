import { commonLangs } from "../langCodes/CommonLangs";
import type LangCodeRecord from "../langCodes/LangCodeRecord";
import type SourceProvider from "./SourceProvider";
import axios from "axios";
import * as cheerio from "cheerio";

const config = {
    headers: {
        "User-Agent": "LanguageLearningZoneSource/1.0 (https://github.com/MaltinR/language-learning-zone)",
    }
};

export default class Wikipedia implements SourceProvider {
  id: string;
  name: string;
  constructor() {
    this.id = "wikipedia";
    this.name = "Wikipedia";
  }

  async next(lang: string): Promise<string> {
    const localCode = langToLocalCode(lang);

    const endPoint = `https://${localCode}.wikipedia.org/wiki/Special:Random`;
    const res = await axios.get(endPoint, config);
    const data = cheerio.load(res.data);
    const ldJsonScript = data('script[type="application/ld+json"]').html()!.toString()!;
    console.log(ldJsonScript);
    const ldJsonData : ScriptResponse = JSON.parse(ldJsonScript);
    
    const parsedUrl = new URL(ldJsonData.url);

    const domain = parsedUrl.hostname;
    const pageTitle = parsedUrl.pathname.split("/").pop();

    const pageDataEndPoint = `https://${domain}/api/rest_v1/page/summary/${pageTitle}`
    console.log(pageDataEndPoint);
    const pageDataRes = await axios.get(pageDataEndPoint, config);
    console.log(pageDataRes.data);
    const pageData : PageDataResponse = pageDataRes.data;

    // console.log(data);
    return pageData.extract;
  }
  async getAllLangs(): Promise<Array<LangCodeRecord>> {
    const endPoint = "https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=languages&format=json";
    const res = await axios.get(endPoint, config);
    // console.log(res);
    const data : LangaugesResponse = res.data;
    const loweredCommonLangs = commonLangs.map(el => ({...el, lang: el.lang.toLowerCase()}));

    const languages: Array<LangCodeRecord> = data.query.languages
      .map((el) => {
          return {
            lang: el.code,
            name: loweredCommonLangs.find(code => code.lang === el.code)?.name ?? "",
          };
      })
      .filter(
        (el) => el!.name != "",
      );
    return languages;
  }
}

function langToLocalCode(lang: string): string {
    return lang;
};

interface ScriptResponse {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    sameAs: string;
    mainEntity: string;
    author: {
        "@type": string;
        "name": string;
    };
    publisher: {
        "@type": string;
        name: string;
        logo: {
            "@type": string;
            url: string;
        };
    },
    datePublished: string;
    dateModified: string;
    headline: string;
}

interface PageDataResponse {
    type: string;
    title: string;
    displaytitle: string;
    namespace: {
        id: number;
        text: string;
    };
    wikibase_item: string;
    titles: {
        canonical: string;
        normalized: string;
        display: string;
    },
    pageid: number;
    thumbnail: {
        source: string;
        width: number;
        height: number;
    },
    originalimage: {
        source: string;
        width: number;
        height: number;
    },
    lang: string;
    dir: string;
    revision: string;
    tid: string;
    timestamp: string;
    description: string;
    description_source: string;
    content_urls: {
        desktop: {
            page: string;
            revisions: string;
            edit: string;
            talk: string;
        };
        mobile: {
            page: string;
            revisions: string;
            edit: string;
            talk: string;
        };
    };
    extract: string;
    extract_html: string;
}

interface LangaugesResponse {
    batchcomplete: string;
    query: {
        languages: Array<{
            code: string;
            bcp47: string;
            "*": string;
        }>
    }
}