import type LangCodeRecord from "./LangCodeRecord";

export default interface LangCodeProvider {
    getAllLangs() : Promise<Array<LangCodeRecord>>;
}