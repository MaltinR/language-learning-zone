import { useCallback, useState } from "react";
import eyeIcon from "../../assets/eye.svg";
import penIcon from "../../assets/pen.svg";
import type SourceProvider from "../../interfaces/SourceProvider";
import type Lang from "../../interfaces/Lang";

function Source({
  sourceProvider,
  fromLang,
  isFetching,
  text,
  setText,
}: {
  sourceProvider: SourceProvider | null;
  fromLang: Lang | null;
  isFetching: boolean;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const onViewButtonClick = useCallback(() => {
    setIsReadOnly((value) => !value);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex">
        <div className="flex-1" />
        <div className="flex-1 text-center font-semibold my-2">Source</div>

        <div className="flex-1 flex justify-end items-center mr-4">
          <button
            onClick={onViewButtonClick}
            className="p-1 rounded-md cursor-pointer hover:bg-stone-400"
          >
            <img className="w-6 h-6" src={isReadOnly ? penIcon : eyeIcon} />
          </button>
        </div>
      </div>

      {!sourceProvider?.langs.some((el) => el.lang === fromLang?.lang) ? (
        <div className="flex-1 flex p-4 items-center">
          <div className="flex-1 text-stone-500 text-wrap text-center">
            <div>Current source doesn't support</div>
            <div>the original language</div>
          </div>
        </div>
      ) : (
        <div
          className={`m-4 bg-stone-800 rounded-md flex flex-1 px-4 py-2 mt-0 border-2 ${isFetching ? "border-emerald-600" : "border-stone-800"}`}
        >
          {isReadOnly ? (
            <div
              className={`flex-1 resize-none ${text != "" ? "text-white" : "text-[#FFFFFF80]"} focus:outline-none`}
            >
              {text != "" ? text : "Click 'Next' to generate text"}
            </div>
          ) : (
            <textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText(e.target.value)
              }
              draggable={false}
              placeholder="Click 'Next' to generate text"
              className="flex-1 text-white resize-none focus:outline-none"
              value={text}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Source;
