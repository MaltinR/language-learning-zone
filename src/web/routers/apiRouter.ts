import express from "express";
import translatorRouter from "./translatorRouter";
import sourceProviderRouter from "./sourceProviderRouter";
import explainerRouter from "./explainerRouter";

export default function apiRouter() {
    const router = express.Router();

    router.use("/translators", translatorRouter());
    router.use("/sourceProviders", sourceProviderRouter());
    router.use("/explainers", explainerRouter());

    return router;
}