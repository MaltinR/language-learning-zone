import express from "express";
import type { Request, Response } from "express";
import translatorRouter from "./translatorRouter";
import sourceProviderRouter from "./sourceProviderRouter";
import explainerRouter from "./explainerRouter";
import { commonLangs } from "../../langCodes/CommonLangs";

export default function apiRouter() {
  const router = express.Router();

  router.use("/translators", translatorRouter());
  router.use("/sourceProviders", sourceProviderRouter());
  router.use("/explainers", explainerRouter());
  router.get("/langs", (req: Request, res: Response) => {
    res.json(commonLangs);
  });

  return router;
}
