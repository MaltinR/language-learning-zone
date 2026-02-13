import { useCallback } from "react";
import TextDropdown from "./TextDropdown";
import type IdText from "../interfaces/IdText";
import removeIcon from "../assets/cross.svg";

function TranslationRow({
  options,
  value,
  translation,
  onSelect,
  onRemoveClick,
}: {
  options: Array<IdText>;
  value: string;
  translation: string;
  onSelect: (id: string) => void;
  onRemoveClick: () => void;
}) {
  return (
    <div className="bg-stone-800 w-full text-center py-2 mb-1 flex flex-col rounded-md">
      <div className="flex items-center pb-2 justify-end mr-2">
        <TextDropdown value={value} className="bg-stone-900" name={"To"} onSelect={onSelect} options={options} />
        <div className="flex items-center justify-center ml-2">
            <button onClick={onRemoveClick} className="text-center text-xl rounded-md cursor-pointer hover:bg-stone-500">
              <img className="w-6 y-6" src={removeIcon} />
            </button>
        </div>
      </div>
      <div className={`bg-stone-900 mx-2 rounded-md py-2 px-4 ${translation === "" ? "text-stone-400" : "text-white"} text-left min-h-10`}>{translation !== "" ? translation : "Click 'Translate' to get translation"}</div>
    </div>
  );
}

export default TranslationRow;
