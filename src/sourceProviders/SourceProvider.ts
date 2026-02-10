import type LangCodeProvider from "../langCodes/LangCodeProvider";

export default interface SourceProvider extends LangCodeProvider{
    id: string;
    name: string;
    next(lang: string): Promise<string>;
}