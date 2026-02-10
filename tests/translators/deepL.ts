import DeepL from "../../src/translators/DeepL";

// Aku muak dengan hal ini. (ind)
async function test() {
    try
    {
        const translator = new DeepL();
        const fromLangs = await translator.getAllFromLangs();
        console.assert(fromLangs != null);
        console.log(`FromLangs: ${fromLangs.length}`);
        
        const toLangs = await translator.getAllToLangs();
        console.assert(toLangs != null);
        console.log(`ToLangs: ${toLangs.length}`);

        const testText = "Aku muak dengan hal ini.";
        const testFromLang = "id";
        const testToLang = "ja";
        const translation = await translator.translate(testText, testFromLang, testToLang);
        console.assert(translation != null);
        console.log(`Translation: '${translation}'`);
    }
    catch (err: any){
        console.error(err);
    }
}

await test();