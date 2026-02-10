import type LangCodeRecord from "../../langCodes/LangCodeRecord";

export default interface SourceProviderInfo {
    id: string;
    name: string;
    langs: Array<LangCodeRecord>,
}