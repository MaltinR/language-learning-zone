import { useCallback, useState } from "react";
import Button from "./Button";

function InputBar({
    isSendable,
  isInited,
  isFetching,
  hasMessages,
  onNewClick,
  onTextSend,
  className,
  buttonClassName,
}: {
    isSendable: boolean;
  isInited: boolean;
  isFetching: boolean;
  hasMessages: boolean;
  onNewClick: () => void;
  onTextSend: (text: string) => void;
  className?: string | null;
  buttonClassName?: string | null;
}) {
  const [inputText, setInputText] = useState<string>("");

  const onSendClick = useCallback(() => {
    onTextSend(inputText);
    setInputText("");
  }, [onTextSend, setInputText, inputText]);

  return (
    <div className={`flex-1 w-full text-white flex ${className}`}>
      {hasMessages ? <Button disabled={isFetching} className={`mr-2 h-full ${buttonClassName}`} onClick={onNewClick}>New</Button> : null}
      <input
        type="text"
        className="focus:outline-none flex-1"
        placeholder="Ask here"
        value={inputText}
        onChange={(e: any) => setInputText(e.target.value)}
      />
      <Button
        disabled={!isSendable || (isFetching || !isInited)}
        className={`ml-2 h-full ${buttonClassName}`}
        onClick={onSendClick}
      >
        {inputText != null && inputText.length > 0 || hasMessages ? "Send" : "Analyze"}
      </Button>
    </div>
  );
}

export default InputBar;