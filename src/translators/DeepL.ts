import axios from "axios";
import type LangCodeRecord from "../langCodes/LangCodeRecord";
import type Translator from "./Translator";
import { commonLangs } from "../langCodes/CommonLangs";

export default class DeepL implements Translator {
    
    origin: string;
    constructor(isFree: boolean = true){
        this.origin = isFree ? "https://api-free.deepl.com" : "https://api.deepl.com";
    }

    async translate(text: string, fromLang: string, toLang: string): Promise<string> {
        
        const endPoint = this.origin + "/v2/translate";
        const apikey = process.env.DEEPL_KEY;
        
        const body = {
            text: [text],
            source_lang: fromLang,
            target_lang: toLang,
        }

        const res = await axios.post(endPoint, body, {
            headers: {
                Authorization: `DeepL-Auth-Key ${apikey}`,
            }
        });

        const data : DeepLTranslationResponse = res.data;
        return data.translations[0]!.text;
    }

    async getAllFromLangs(): Promise<Array<LangCodeRecord>> {
        const commonLangCodes = commonLangs.map(el => el.lang);

        const endPoint = this.origin + "/v2/languages" + "?type=source";
        const apikey = process.env.DEEPL_KEY;
        // console.log(`Key: '${apikey}'`);
        const res = await axios.get(endPoint, {
            headers: {
                Authorization: `DeepL-Auth-Key ${apikey}`,
            }
        });

        const data = res.data;

        const languages : Array<LangCodeRecord> = (data as Array<DeepLLanguagesResponseRecord>).map(el => {
            return {
                lang: el.language,
                name: el.name,
            };
        }).filter(el => commonLangCodes.includes(el.lang));

        return languages;
    }
    
    async getAllToLangs(): Promise<Array<LangCodeRecord>> {
        const commonLangCodes = commonLangs.map(el => el.lang);

        const endPoint = this.origin + "/v2/languages" + "?type=target";
        const apikey = process.env.DEEPL_KEY;
        // console.log(`Key: '${apikey}'`);
        const res = await axios.get(endPoint, {
            headers: {
                Authorization: `DeepL-Auth-Key ${apikey}`,
            }
        });

        const data = res.data;

        const languages : Array<LangCodeRecord> = (data as Array<DeepLLanguagesResponseRecord>).map(el => {
            return {
                lang: el.language.toLowerCase(),
                name: el.name,
            };
        }).filter(el => commonLangCodes.includes(el.lang));

        return languages;
    }
}

interface DeepLLanguagesResponseRecord {
    language: string;
    name: string;
    supports_formality: boolean;
}

interface DeepLTranslationResponseTranslation {
    detected_source_language: string;
    text: string;
    billed_characters: number;
    model_type_used: string;
}

interface DeepLTranslationResponse {
    translations: Array<DeepLTranslationResponseTranslation>;
}