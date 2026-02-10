import express from "express";
import type { Request, Response } from "express";
import type SourceProvider from "../../sourceProviders/SourceProvider";
import Tatoeba from "../../sourceProviders/Tatoeba";
import type SourceNextRequest from "../interfaces/SourceNextRequest";
import type SourceNextResponse from "../interfaces/SourceNextResponse";
import type SourceProviderInfo from "../interfaces/SourceProviderInfo";

const sourceProviders : Array<SourceProvider> = [
    new Tatoeba(),
];
const sourceProviderMap = sourceProviders.reduce<Record<string, SourceProvider>>((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {});

export default function sourceProviderRouter() {
    const router = express.Router();

    router.get("/", async (req : Request, res: Response) => {
        // res.json(translators.map(el => ({id: el.id, name: el.name})));
        const infoPromises : Array<Promise<SourceProviderInfo>> = sourceProviders.map(async (el) => {
            const langs = await el.getAllLangs();
            const info : SourceProviderInfo = {
                id: el.id,
                name: el.name,
                langs: langs,
            }
            return info;
        })

        const result = await Promise.all(infoPromises);

        res.json(result);
    });

    router.post("/:id/next", async (req: Request, res: Response) => {
        const id: string = req.params.id as string;
        const body: SourceNextRequest = req.body;
        if (body == null) {
            return res.status(400).json({error: "Invalid body"});
        }

        const sourceProvider = sourceProviderMap[id];
        const nextText = await sourceProvider!.next(body.lang);
        const response: SourceNextResponse = {
            input: body,
            sourceProvider: {
                id: sourceProvider!.id,
                name: sourceProvider!.name,
            },
            result: nextText,
        }
        res.json(response);
    });
    
    return router;
}