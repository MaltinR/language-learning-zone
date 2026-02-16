import type MessageData from "../interfaces/MessageData";
import type { Role } from "../types/Role";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';

function Message({ message, useMargin = true }: { message: MessageData; useMargin?: boolean }) {
  return (
    <div className="flex-1 w-full my-2">
      <div
        className={`mx-2 px-4 py-2 rounded-xl border ${getClassNameByRole(message.role, useMargin)}`}
      >
        <Markdown remarkPlugins={[remarkGfm]}>
        {message.text}
        </Markdown>
      </div>
    </div>
  );
}

function getClassNameByRole(role: Role, useMargin: boolean) {
  if (role === "user") {
    if (useMargin)
    {
      return "bg-stone-800 border-stone-700 rounded-br-none ml-20";
    }
    else 
    {
      return "bg-stone-800 border-stone-700 rounded-br-none";
    }
  } else {
    if (useMargin) {
      return "bg-stone-600 border-stone-500 rounded-bl-none mr-20";
    }
    else 
    {
      return "bg-stone-600 border-stone-500 rounded-bl-none";
    }
  }
}

export default Message;
