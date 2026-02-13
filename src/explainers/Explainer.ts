import type Message from "./Message";

export default interface Explainer {
  id: string;
  name: string;
  // Text Formating (Replace to argument)
  explain(
    text: string,
    textLang: string,
    explainLang: string,
    promptTemplate: string,
    history?: Array<Message> | null,
    onTextUpdate?: ((deltaText: string) => void) | null,
  ): Promise<string>;
}
