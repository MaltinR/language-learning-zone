import type LangCodeRecord from "../langCodes/LangCodeRecord";

export default interface Translator {
    // Consider support context
    translate(text: string, fromLang: string, toLang: string) : Promise<string>;
    getAllFromLangs() : Promise<Array<LangCodeRecord>>;
    getAllToLangs() : Promise<Array<LangCodeRecord>>;
}