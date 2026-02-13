import axios from "axios";
import type Explainer from "./Explainer";
import * as utils from "./utils";
import type Message from "./Message";

export default class GeminiRest implements Explainer {
  id: string;
  name: string;
  useStream: boolean;
  origin: string;

  constructor(useStream: boolean = false) {
    this.id = "gemini_rest";
    this.name = "Gemini";
    this.useStream = useStream;
    this.origin = "https://generativelanguage.googleapis.com";
  }

  async explain(
    text: string,
    textLang: string,
    explainLang: string,
    promptTemplate: string,
    history?: Array<Message> | null,
    onTextUpdate?: ((deltaText: string) => void) | null,
  ): Promise<string> {
    const prompt = utils.fromTemplate(promptTemplate, textLang, explainLang);

    const endPoint =
      this.origin +
      (this.useStream
        ? "/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse"
        : "/v1beta/models/gemini-2.5-flash:generateContent");

    const apiKey = process.env.GEMINI_KEY;
    console.assert(apiKey != null);

    const body = this.getBody(prompt, text, history);

    console.log(JSON.stringify(body));

    if (this.useStream) {
      const res = await axios.post(endPoint, body, {
        headers: {
          "x-goog-api-key": apiKey,
        },
        responseType: "stream",
        adapter: "fetch",
      });
      const stream = res.data;
      const decoder = new TextDecoder();

      let fullText = "";
      for await (const chunk of stream) {
        const text = decoder.decode(chunk);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.substring(6));
              const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) {
                fullText += content;
                onTextUpdate?.(content);
              }
            } catch (e) {
              // Handle partial JSON chunks
            }
          }
        }
      }
      return fullText;
    } else {
      const res = await axios.post(endPoint, body, {
        headers: {
          "x-goog-api-key": apiKey,
        },
      });

      const data: GenerateContentResponse = res.data;

      return data.candidates[0].content.parts[0].text;
    }
  }

  getBody(
    systemPrompt: string,
    text: string,
    history: Array<Message> | null | undefined,
  ): Object {
    // history will ignore text
    const contents =
      history != null
        ? history.map((el) => toGeminiMessage(el.role, el.text))
        : [toGeminiMessage("user", text)];
    // contents.push(toGeminiMessage("user", text));

    const body = {
      system_instruction: {
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
      contents,
    };
    return body;
  }
}

function toGeminiMessage(role: string, text: string) {
  return {
    parts: [
      {
        text,
      },
    ],
    role: role === "assistant" ? "model" : role,
  };
}

interface GenerateContentResponse {
  candidates: [
    {
      content: {
        parts: [
          {
            text: string;
          },
        ];
      };
      role: string;
    },
  ];
}
