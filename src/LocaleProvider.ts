import type LocaleRecord from "./LocaleRecord";

export default interface LocaleProvider {
    getAllLocales() : Promise<Array<LocaleRecord>>;
}