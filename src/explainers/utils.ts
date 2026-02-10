export function fromTemplate(promptTemplate: string, textLang: string, explainLang: string): string {
    return promptTemplate.replaceAll("{textLang}", textLang).replaceAll("{explainLang}", explainLang);
}