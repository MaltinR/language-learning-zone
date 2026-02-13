import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";
import TextDropdown from "./TextDropdown";
import type IdText from "../interfaces/IdText";
import type Lang from "../interfaces/Lang";
import axios from "axios";
import type MessageData from "../interfaces/MessageData";
import Message from "./Message";

interface Explainer {
  id: string;
  name: string;
}

interface ExplainResponse {
  type: "result" | "deltaText";
  deltaText: string;
}

interface ExplainRequest {
  text: string;
  textLang: string;
  explainLang: string;
  promptTemplate: string;
  history: Array<MessageData>;
}

const testMessages: Array<MessageData> = [
  {
    role: "user",
    text: "Hello world 1",
  },
  {
    role: "assistant",
    text: "Hello world 2",
  },
  {
    role: "user",
    text: "Hello world 3",
  },
  {
    role: "assistant",
    text: '好的，這句話的翻譯和逐字解釋如下：\n\n---\n\n**Original Japanese:** それがほしいんでしょう、そうじゃありませんか。\n\n**Traditional Chinese Translation:** 你想要那個的吧？不是嗎？\n\n---\n\n**Word-by-word grammatical explanation:**\n\n1.  **それ (sore)**\n    *   **Meaning:** That; it.\n    *   **Traditional Chinese:** **那個 (nà ge)**\n        *   **Literal Meaning:** That one / That thing.\n        *   **Grammatical Role:** Demonstrative pronoun, acting as the object of desire.\n\n2.  **が (ga)**\n    *   **Meaning:** Subject particle. In the phrase "それがほしい," "それ" is technically the subject of the adjective "ほしい."\n    *   **Traditional Chinese:** (Implied / not directly translated)\n        *   **Explanation:** In Chinese, the subject particle is often omitted when the subject is clear, especially when referring to an object of desire. The structure "你想要那個" already clearly indicates "你 (you)" as the subject of the action "想要 (want)" and "那個 (that)" as the object.\n\n3.  **ほしい (hoshii)**\n    *   **Meaning:** To want; to desire (an object). (It\'s an い-adjective in Japanese).\n    *   **Traditional Chinese:** **想要 (xiǎng yào)**\n        *   **Literal Meaning:** Think-want / Desire.\n        *   **Grammatical Role:** Verb phrase expressing desire. "要 (yào)" alone means "want" or "need," but "想要 (xiǎng yào)" emphasizes the *desire* aspect more, which matches the nuance of "ほしい."\n\n4.  **んでしょう (ndeshō)**\n    *   **Meaning:** This is a contraction of "のです" (no desu - indicating explanation or emphasis) + "でしょう" (deshō - indicating conjecture, likelihood, or seeking confirmation, often politely). Together, it means "It is that you want it, right?" or "You probably want it, don\'t you?" It implies the speaker is making an assumption and seeking confirmation.\n    *   **Traditional Chinese:** **的吧 (de ba)**\n        *   **Literal Meaning:** [Emphatic/explanatory particle] + [Question/conjecture particle].\n        *   **Grammatical Role:** Modal particle phrase indicating a guess, assumption, or seeking agreement.\n            *   **的 (de):** Similar to Japanese "の (no)" in "のです," it adds emphasis or explanatory nuance to the preceding statement, suggesting "it\'s the case that..."\n            *   **吧 (ba):** Similar to Japanese "でしょう," it turns the statement into a question seeking confirmation or expressing conjecture, meaning "right?" "I suppose," "isn\'t it?"\n\n5.  **そう (sō)**\n    *   **Meaning:** That way; like that; so.\n    *   **Traditional Chinese:** (Implied / incorporated into the following phrase)\n        *   **Explanation:** The "so" or "that way" is naturally included in the broader question of confirmation.\n\n6.  **じゃありませんか (ja arimasen ka)**\n    *   **Meaning:** Is it not so? / Isn\'t that right? (Polite negative question form of "です"). It\'s a direct way to seek strong confirmation, often with a rhetorical or challenging tone.\n    *   **Traditional Chinese:** **不是嗎 (bú shì ma)**\n        *   **Literal Meaning:** Not be particle.\n        *   **Grammatical Role:** Rhetorical question tag.\n            *   **不 (bù):** Negation particle, "not."\n            *   **是 (shì):** Verb "to be," "is."\n            *   **嗎 (ma):** Question particle.\n        *   **Explanation:** Together, "不是嗎" directly translates to "isn\'t it?" or "am I wrong?", perfectly matching the function of "じゃありませんか." It reinforces the previous assumption with a direct challenge for denial.\n\n---\n😊',
  },
];

async function initFetch(
  setIsInited: React.Dispatch<React.SetStateAction<boolean>>,
  setExplainers: React.Dispatch<React.SetStateAction<Explainer[]>>,
  setPromptTemplate: React.Dispatch<React.SetStateAction<string>>,
  setCurrentExplainer: React.Dispatch<React.SetStateAction<Explainer | null>>,
) {
  try {
    const [res, promptTemplateRes] = await Promise.all([
      axios.get("/api/explainers"),
      axios.get("/api/explainers/promptTemplate"),
    ]);
    const explainers: Array<Explainer> = res.data;
    const promptTemplate = promptTemplateRes.data.result;

    setExplainers(explainers);
    setCurrentExplainer(explainers[0]);
    setPromptTemplate(promptTemplate);
    setIsInited(true);
  } catch (err: any) {
    console.error(err);
  }
}

function getBody(
  text: string,
  textLang: string,
  explainLang: string,
  promptTemplate: string,
  history: Array<MessageData>,
): ExplainRequest {
  return {
    text,
    textLang,
    explainLang,
    promptTemplate,
    history,
  };
}

function Explainer({
  text,
  fromLangs,
  toLangs,
  updatedFromLang,
  updatedToLang,
}: {
  text: string;
  fromLangs: Array<Lang>;
  toLangs: Array<Lang>;
  updatedFromLang: string | null; updatedToLang: string | null
}) {
  const [isInited, setIsInited] = useState<boolean>(false);
  const [explainers, setExplainers] = useState<Array<Explainer>>([]);

  const [promptTemplate, setPromptTemplate] = useState<string>("");
  const [fromLang, setFromLang] = useState<Lang | null>(fromLangs[0]);
  const [toLang, setToLang] = useState<Lang | null>(toLangs[0]);
  const [currentExplainer, setCurrentExplainer] = useState<Explainer | null>(
    null,
  );

  const [messages, setMessages] = useState<Array<MessageData>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const explainerOptions: Array<IdText> = useMemo(() => {
    return explainers.map((explainer) => ({
      id: explainer.id,
      text: explainer.name,
    }));
  }, [explainers]);

  const fromLangOptions: Array<IdText> = useMemo(() => {
    return fromLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [fromLangs]);

  const toLangOptions: Array<IdText> = useMemo(() => {
    return toLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [toLangs]);

  const explain = useCallback(
    async (text: string, inputText: string) => {
      if (isFetching) return;
      const freezedMessages : Array<MessageData> = [...messages];
      if (inputText != null) freezedMessages.push({role: "user", text: inputText});
      const payloadMessages : Array<MessageData> = inputText != "" ? [...messages, {role: "user", text }, {role: "user", text: inputText}] : [...messages];
      console.log(freezedMessages);

      const updateText = (fullText: string) => {
        setMessages([
          ...freezedMessages,
          {
            role: "assistant",
            text: fullText,
          },
        ]);
      };

      try {
        setIsFetching(true);
        const body = getBody(
          text,
          fromLang!.lang,
          toLang!.lang,
          promptTemplate,
          payloadMessages,
        );
        console.log(JSON.stringify(body));

        const response = (await fetch(
          `/api/explainers/${currentExplainer!.id}/explain`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        ))!;
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        const handleResponse = (response: ExplainResponse) => {
          console.log("Received:", response);
          if (response.type === "deltaText") {
            fullText += response.deltaText;
            updateText(fullText);
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n");

          buffer = parts.pop()!; // keep incomplete chunk
          for (const part of parts) {
            if (part.trim()) {
              const res: ExplainResponse = JSON.parse(part);
              handleResponse(res);
            }
          }
        }

        if (buffer.trim()) {
          const res: ExplainResponse = JSON.parse(buffer);
          handleResponse(res);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    },
    [
      setIsFetching,
      setMessages,
      isFetching,
      messages,
      currentExplainer,
      fromLang,
      toLang,
      promptTemplate,
    ],
  );

  const onExplainerSelect = useCallback(
    (id: string) => {
      return setCurrentExplainer(
        explainers.find((explainer) => explainer.id == id)!,
      );
    },
    [setCurrentExplainer, explainers],
  );

  const onFromLangSelect = useCallback(
    (id: string) => {
      setFromLang(fromLangs.find((lang) => lang.lang === id)!);
    },
    [setFromLang, fromLangs],
  );
  const onToLangSelect = useCallback(
    (id: string) => {
      setToLang(toLangs.find((lang) => lang.lang === id)!);
    },
    [setToLang, toLangs],
  );

  const onTextSend = useCallback(
    (inputText: string) => {
      explain(text, inputText);
      // Just analyze
      if (inputText.length > 0) {
        setMessages((messages) => [
          ...messages,
          { role: "user", text: inputText },
        ]);
      }
    },
    [setMessages, explain, text],
  );

  const onNewClick = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  useEffect(() => {
    initFetch(
      setIsInited,
      setExplainers,
      setPromptTemplate,
      setCurrentExplainer,
    );
  }, []);

  useEffect(() => {
    if (updatedFromLang == null) return;
    const fromLang = fromLangs.find(lang => lang.lang === updatedFromLang);
    if (fromLang == null) return;
    setFromLang(fromLang);
  }, [setFromLang, updatedFromLang, fromLangs]);

  useEffect(() => {
    if (updatedToLang == null) return;
    const toLang = toLangs.find(lang => lang.lang === updatedToLang);
    if (toLang == null) return;
    setToLang(toLang);
  }, [setToLang, updatedToLang, toLangs]);

  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Header */}
      <div className="border-b-2 flex flex-row justify-between items-center">
        <div className="text-white px-6 py-3 font-bold text-xl">Explainer</div>
        <div className="pr-4 flex flex-wrap items-center">
          <Dropdown
            className="bg-stone-800 rounded text-white p-1 w-25 focus:outline-none mx-2"
            onSelect={onExplainerSelect}
            options={explainerOptions}
            value={currentExplainer?.id ?? "-"}
          />
          <TextDropdown
            name={"From"}
            onSelect={onFromLangSelect}
            options={fromLangOptions}
            value={fromLang?.lang ?? "-"}
          />
          <TextDropdown
            name={"To"}
            onSelect={onToLangSelect}
            options={toLangOptions}
            value={toLang?.lang ?? "-"}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 flex flex-col overflow-y-auto ">
        <div className={`text-white flex-1 flex flex-col border-2 ${isFetching ? "border-emerald-600" : "border-stone-900"}`}>
          <div className="flex">
            <div className="flex flex-col flex-1 items-center mx-2 mt-2">
              {/* Messages */}
              {messages.map((message) => (
                <Message message={message} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex px-3 py-3 justify-center mb-1 border-t-2">
        <InputBar
          isInited={isInited}
          isFetching={isFetching}
          hasMessages={messages.length > 0}
          onNewClick={onNewClick}
          onTextSend={onTextSend}
        />
      </div>
    </div>
  );
}

function InputBar({
  isInited,
  isFetching,
  hasMessages,
  onNewClick,
  onTextSend,
}: {
  isInited: boolean;
  isFetching: boolean;
  hasMessages: boolean;
  onNewClick: () => void;
  onTextSend: (text: string) => void;
}) {
  const [inputText, setInputText] = useState<string>("");

  const onSendClick = useCallback(() => {
    onTextSend(inputText);
    setInputText("");
  }, [onTextSend, setInputText, inputText]);

  return (
    <div className="flex-1 w-full text-white flex">
      {hasMessages ? <Button className="mr-2" onClick={onNewClick}>New</Button> : null}
      <input
        type="text"
        className="focus:outline-none flex-1"
        placeholder="Ask here"
        value={inputText}
        onChange={(e: any) => setInputText(e.target.value)}
      />
      <Button
        disabled={isFetching || !isInited}
        className=""
        onClick={onSendClick}
      >
        {inputText != null && inputText.length > 0 || hasMessages ? "Send" : "Analyze"}
      </Button>
    </div>
  );
}

export default Explainer;
