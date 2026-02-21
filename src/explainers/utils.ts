export function fromTemplate(promptTemplate: string, textLang: string, explainLang: string): string {
    const prompt = promptTemplate.replaceAll("{textLang}", textLang).replaceAll("{explainLang}", explainLang);
    console.log("prompt", prompt);
    return prompt;
}