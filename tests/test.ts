import type Explainer from "../src/explainers/Explainer";
import GeminiRest from "../src/explainers/GeminiRest";
import type SourceProvider from "../src/sourceProviders/SourceProvider";
import Tatoeba from "../src/sourceProviders/Tatoeba";
import DeepL from "../src/translators/DeepL";
import type Translator from "../src/translators/Translator";

async function test(targetLang: string, translateLang: string) {
    const source : SourceProvider = new Tatoeba();
    const translator : Translator = new DeepL();
    const explainer : Explainer = new GeminiRest();

    const sourceLangs = await source.getAllLangs();

    const translatorLangs = await translator.getAllFromLangs();
    const intersectedLangs = sourceLangs.filter(el => translatorLangs.some(lang => el.lang == lang.lang));
    console.log(`sourceLangs: ${sourceLangs.length}`);
    console.log(`translatorLangs: ${translatorLangs.length}`);
    console.log(`intersectedLangs: ${intersectedLangs.length}`);
    const lang = intersectedLangs[randomInt(0, intersectedLangs.length)];
    console.log(`Lang: ${lang!.lang}(${lang!.name})`);
    const text = await source.next(lang!.lang);
    console.log(`Text: ${text}`);
    const translation = await translator.translate(text, lang!.lang, translateLang);
    console.log(`Translation: ${translation}`);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const targetLang = "ja";
const translateLang = "zh";

await test(targetLang, translateLang);