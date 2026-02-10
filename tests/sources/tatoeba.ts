import Tatoeba from "../../src/sourceProviders/Tatoeba";

async function test() {
  try {
    const source = new Tatoeba();

    const langs = await source.getAllLangs();
    console.assert(langs != null);
    console.log(`Locales count: ${langs.length}`);
    // const locale = 

    const lang = langs[randomInt(0, langs.length)];
    console.log(`Locale: '${lang!.lang}' (${lang!.name})`);
    const text = await source.next(lang!.lang);
    console.assert(text != null);
    console.log(`Text: '${text}'`);
  } catch (e: any) {
    console.error(e);
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await test();