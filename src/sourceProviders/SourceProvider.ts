import type LangCodeProvider from "../langCodes/LangCodeProvider";

export default interface SourceProvider extends LangCodeProvider{
    next(locale: string): Promise<string>;
}