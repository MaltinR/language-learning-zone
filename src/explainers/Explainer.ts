export default interface Explainer {
    id: string;
    name: string;
    // Text Formating (Replace to argument)
    explain(text: string, textLang: string, explainLang: string, promptTemplate: string, onTextUpdate?: ((deltaText: string) => void) | null): Promise<string>;
}