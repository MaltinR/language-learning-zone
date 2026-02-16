import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Message from "../../components/Message";
import type MessageData from "../../interfaces/MessageData";
import type Explainer from "../../interfaces/Explainer";
import type Lang from "../../interfaces/Lang";
import type ExplainRequest from "../../interfaces/explainer/ExplainRequest";
import type ExplainResponse from "../../interfaces/explainer/ExplainResponse";
import axios from "axios";
import BottomBar from "./BottomBar";
import InputBar from "../../components/InputBar";

async function initFetch(
  setPromptTemplate: React.Dispatch<React.SetStateAction<string>>,
  setIsInited: React.Dispatch<React.SetStateAction<boolean>>,
) {
  try {
    const promptTemplateRes = await axios.get("/api/explainers/promptTemplate");
    const promptTemplate = promptTemplateRes.data.result;

    setPromptTemplate(promptTemplate);
    setIsInited(true);
  } catch (err: any) {
    console.error(err);
    window.alert("Error occurred while fetching prompt template");
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

function ExplainPage({
  explainer,
  text,
  fromLang,
  toLang,
  messages,
  setMessages,
}: {
  explainer: Explainer | null;
  text: string;
  fromLang: Lang | null;
  toLang: Lang | null;
  messages: Array<MessageData>;
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isInited, setIsInited] = useState<boolean>(false);
  const [promptTemplate, setPromptTemplate] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const isSendable = useMemo(() => {
    return text.length > 0;
  }, [text]);

  const explain = useCallback(
    async (text: string, inputText: string) => {
      if (isFetching) return;
      const freezedMessages: Array<MessageData> = [...messages];
      if (inputText != null && inputText != "")
        freezedMessages.push({ role: "user", text: inputText });
      const payloadMessages: Array<MessageData> =
        inputText != ""
          ? [
              ...messages,
              { role: "user", text },
              { role: "user", text: inputText },
            ]
          : [...messages];
      // console.log(freezedMessages);

      // Debug
      // const start = Date.now();
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
        // console.log(JSON.stringify(body));

        const response = (await fetch(
          `/api/explainers/${explainer!.id}/explain`,
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
          // console.log("Received:", (Date.now() - start).toString(), response);
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
        window.alert("Error occurred while fetching explanation");
      } finally {
        setIsFetching(false);
      }
    },
    [
      setIsFetching,
      setMessages,
      isFetching,
      messages,
      explainer,
      fromLang,
      toLang,
      promptTemplate,
    ],
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
    initFetch(setPromptTemplate, setIsInited);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages]); // run whenever messages change

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      <div
        ref={containerRef}
        className="flex-1 flex flex-col overflow-y-auto m-1 mb-2"
      >
        <div
          className={`text-white flex-1 flex flex-col rounded-md border-2 ${isFetching ? "border-emerald-600" : "border-stone-900"}`}
        >
          <div className="flex">
            <div className="flex flex-col flex-1 items-center mx-2 mt-2 text-[12px]">
              {messages.map((message, index) => (
                <Message
                  key={index.toString()}
                  message={message}
                  useMargin={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomBar className="mx-2 mb-2">
        <InputBar
          className="h-full"
          isSendable={isSendable}
          isInited={isInited}
          isFetching={isFetching}
          hasMessages={messages.length > 0}
          onNewClick={onNewClick}
          onTextSend={onTextSend}
        />
      </BottomBar>
    </div>
  );
}

export default ExplainPage;
