import type MessageData from "../MessageData";

export default interface ExplainRequest {
  text: string;
  textLang: string;
  explainLang: string;
  promptTemplate: string;
  history: Array<MessageData>;
}