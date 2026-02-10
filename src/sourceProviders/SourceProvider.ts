import type LocaleProvider from "../LocaleProvider";

export default interface SourceProvider extends LocaleProvider{
    next(locale: string): Promise<string>;
}