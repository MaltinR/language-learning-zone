import Tatoeba from "./sourceProviders/Tatoeba";
import DeepL from "./translators/DeepL";

// Have no standard code yet
const fromLang = "ID";
const toLang = "EN";

// const source = new Tatoeba();
// const langs = await source.getAllLangs();

const translator = new DeepL();
// const langs = await translator.getAllFromLangs();

// langs.forEach(el => {
//     console.log(`${el.lang} (${el.name})`);
// })