import { Tatoeba } from "../../src/sourceProviders/Tatoeba";

async function test() {
  try {
    const source = new Tatoeba();

    const locales = await source.getAllLocales();
    console.assert(locales != null);
    console.log(`Locales count: ${locales.length}`);
    
    const locale = "ind";
    const text = await source.next(locale);
    console.assert(text != null);
    console.log(`Text: '${text}'`);
  } catch (e: any) {
    console.error(e);
  }
}


await test();