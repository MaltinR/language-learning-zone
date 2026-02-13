import express from "express";
import type { Request, Response } from "express";
import GeminiRest from "../../explainers/GeminiRest";
import type Explainer from "../../explainers/Explainer";
import type ExplainRequest from "../interfaces/ExplainRequest";
import type ExplainResponse from "../interfaces/ExplainResponse";
import type PromptTemplateResponse from "../interfaces/PromptTemplateResponse";

const explainers: Array<Explainer> = [new GeminiRest(true)];
const explainerMap = explainers.reduce<Record<string, Explainer>>(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {},
);

export default function explainerRouter() {
  const router = express.Router();

  router.get("/", (req: Request, res: Response) => {
    res.json(explainers.map((el) => ({ id: el.id, name: el.name })));
  });

  router.get("/promptTemplate", async (req: Request, res: Response) => {
    const promptTemplatePath = "./explainerTemplates/default.txt";
    const promptTemplateFile = Bun.file(promptTemplatePath);
    const promptTemplate = await promptTemplateFile.text();
    const response: PromptTemplateResponse = {
      result: promptTemplate,
    };
    res.json(response);
  });

  router.post("/:id/explain", async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id as string;
      const body: ExplainRequest = req.body;
      if (body == null) {
        return res.status(400).json({ error: "Invalid body" });
      }

      let isFirst = true;
      const onTextUpdate = (deltaText: string) => {
        if (isFirst) {
            res.setHeader('Content-Type', 'application/x-ndjson');
            isFirst = false;
        }
        res.write(JSON.stringify({type: "deltaText", deltaText}) + "\n");
      };

      const explainer = explainerMap[id];
      const explanation = await explainer!.explain(
        body.text,
        body.textLang,
        body.explainLang,
        body.promptTemplate,
        body.history,
        onTextUpdate,
      );
      const response: ExplainResponse = {
        input: body,
        explainer: {
          id: explainer!.id,
          name: explainer!.name,
        },
        result: explanation,
      };
      res.write(JSON.stringify({...response, type: "result", }) + "\n");
      res.end();
    } catch (err: any) {
      console.error(err);
      res.status(400).json(err);
    }
  });

  return router;
}
