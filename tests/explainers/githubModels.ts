import GeminiRest from "../../src/explainers/GeminiRest";
import GithubModels from "../../src/explainers/GithubModels";

// それがほしいんでしょう、そうじゃありませんか。 jpn
async function test() {
    const explainer = new GithubModels(true);

    const testText = "それがほしいんでしょう、そうじゃありませんか。";
    const testExplainLang = "Traditional Chinese";
    const testTextLang = "Japanese";

    console.log(`Text: '${testText}'`)
    const promptTemplatePath = "./explainerTemplates/default.txt";
    const promptTemplateFile = Bun.file(promptTemplatePath);
    const promptTemplate = await promptTemplateFile.text();
    console.assert(promptTemplate != null);
    console.log(`PromptTemplate: '${promptTemplate}'`);

    const explanation = await explainer.explain(testText, testTextLang, testExplainLang, promptTemplate, [], onTextUpdate);
    console.assert(explanation != null);
    console.log(`Explanation: '${explanation}'`);
}

function onTextUpdate(deltaText: string)
{
    console.log(deltaText);
}

await test();