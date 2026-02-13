import type Message from "../../explainers/Message";

export default interface ExplainRequest {
    text: string;
    textLang: string;
    explainLang: string;
    promptTemplate: string;
    history: Array<Message> | null;
}