import type LangCodeRecord from "../../langCodes/LangCodeRecord";

export default interface TranslatorInfo {
    id: string;
    name: string;
    fromLangs: Array<LangCodeRecord>,
    toLangs: Array<LangCodeRecord>,
}