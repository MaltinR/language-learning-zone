import express from "express";
import apiRouter from "./web/routers/apiRouter";

const app = express();
const port = 1668;

app.use(express.json());
app.use("/api", apiRouter());

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});