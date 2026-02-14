import axios from "axios";
import type Explainer from "./Explainer";
import * as utils from "./utils";
import type Message from "./Message";

export default class GithubModels implements Explainer {
  id: string;
  name: string;
  useStream: boolean;
  origin: string;

  constructor(useStream: boolean = false) {
    this.id = "github_models";
    this.name = "Github Models";
    this.useStream = useStream;
    this.origin = "https://models.github.ai/inference/chat/completions";
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

    const endPoint = this.origin;

    const apiKey = process.env.GITHUB_MODEL_KEY;
    console.assert(apiKey != null);

    const body = this.getBody(this.useStream, prompt, text, history);

    console.log(JSON.stringify(body));

    if (this.useStream) {
      const res = await axios.post(endPoint, body, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: "stream",
        adapter: "fetch",
      });
      const stream = res.data;
      const decoder = new TextDecoder();

      let fullText = "";
      const startTime = Date.now();
      for await (const chunk of stream) {
        const text = decoder.decode(chunk);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json : StreamChunkResponse = JSON.parse(line.substring(6));
              const content = json.choices.length > 0 ? json.choices[0]?.delta?.content : null;
              if (content != null) {
                fullText += content;
                console.log(`[${Date.now() - startTime}] ${content}`);
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

      const data: CompletionsResponse = res.data;

      return data.choices[0]!.message.content;
    }
  }

  getBody(
    useStream: boolean,
    systemPrompt: string,
    text: string,
    history: Array<Message> | null | undefined,
    model: string = "xai/grok-3-mini",
    temperature: number = 1,
    top_p: number = 1,
  ): Object {
    // history will ignore text
    const conversation =
      history != null && history.length > 0
        ? history.map((el) => toMessage(el.role, el.text))
        : [toMessage("user", text)];

    const messages = [toMessage("system", systemPrompt), ...conversation];

    const body = {
        messages,
        temperature,
        top_p,
        model,
        stream: useStream,
    };

    return body;
  }
}

function toMessage(role: string, text: string) {
  return {
    content: text,
    role: role,
  };
}

interface CompletionsResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
            tool_calls: any;
            resoning_content: string;
            refusal: any;
        },
        logprobs: any;
        finish_reason: string;
        stop_reason: any;
    }>,
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        prompt_tokens_details: {
            text_tokens: number;
            audio_tokens: number;
            image_tokens: number;
            cached_tokens: number;
        };
        completion_tokens_details: {
            reasoning_tokens: number;
            audio_tokens: number;
            accepted_prediction_tokens: number;
            rejected_prediction_tokens: number;
        };
        num_sources_used: number;
    };
}

interface StreamChunkResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        delta: {
            content?: string;
            reasoning_content?: string;
            role?: string;
        },
        finish_reason?: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        prompt_tokens_details: {
            text_tokens: number;
            audio_tokens: number;
            image_tokens: number;
            cached_tokens: number;
        };
        completion_tokens_details: {
            reasoning_tokens: number;
            audio_tokens: number;
            accepted_prediction_tokens: number;
            rejected_prediction_tokens: number;
        };
        num_sources_used: number;
    };
    system_fingerprint: string;
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
