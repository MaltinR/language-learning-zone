import type LangCodeProvider from "../langCodes/LangCodeProvider";

export default interface SourceProvider extends LangCodeProvider{
    next(lang: string): Promise<string>;
}