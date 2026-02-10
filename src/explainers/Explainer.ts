export default interface Explainer {
    // Text Formating (Replace to argument)
    explain(text: string, locale: string, prompt: string): string;
}