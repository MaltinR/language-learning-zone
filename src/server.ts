import express from "express";
import path from "path";
import apiRouter from "./web/routers/apiRouter";

const app = express();
const port = 1668;

app.use(express.json());
app.use("/api", apiRouter());

// Serve static React files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend", "dist"))); // or "build"

// Catch-all: send index.html for React routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});