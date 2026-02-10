import type LocaleProvider from "../LocaleProvider";

export default interface Translator extends LocaleProvider {
    translate(text: string, fromLocal: string, toLocal: string) : string;
}