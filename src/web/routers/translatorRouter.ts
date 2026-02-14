import express from "express";
import type { Request, Response } from "express";
import DeepL from "../../translators/DeepL";
import type TranslateRequest from "../interfaces/TranslateRequest";
import type TranslateResponse from "../interfaces/TranslateResponse";
import type Translator from "../../translators/Translator";
import type TranslatorInfo from "../interfaces/TranslatorInfo";
import GoogleTranslate from "../../translators/GoogleTranslate";

const translators : Array<Translator> = [
    new GoogleTranslate(),
    new DeepL(),
];
const translatorMap = translators.reduce<Record<string, Translator>>((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {});

export default function translatorRouter() {
    const router = express.Router();

    router.get("/", async (req : Request, res: Response) => {
        // res.json(translators.map(el => ({id: el.id, name: el.name})));
        const infoPromises : Array<Promise<TranslatorInfo>> = translators.map(async (el) => {
            const [fromLangs, toLangs] = await Promise.all([
                el.getAllFromLangs(),
                el.getAllToLangs(),
            ]);
            const info : TranslatorInfo = {
                id: el.id,
                name: el.name,
                fromLangs: fromLangs,
                toLangs: toLangs,
            }
            return info;
        })

        const result = await Promise.all(infoPromises);

        res.json(result);
    });

    router.post("/:id/translate", async (req: Request, res: Response) => {
        const id: string = req.params.id as string;
        const body: TranslateRequest = req.body;
        if (body == null) {
            return res.status(400).json({error: "Invalid body"});
        }

        const translator = translatorMap[id];
        const translation = await translator!.translate(body.text, body.fromLang, body.toLang);
        const response: TranslateResponse = {
            input: body,
            translator: {
                id: translator!.id,
                name: translator!.name,
            },
            result: translation,
        }
        res.json(response);
    });

    return router;
}