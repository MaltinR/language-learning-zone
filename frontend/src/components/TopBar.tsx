import { useCallback, useMemo, useState } from "react";
import Dropdown from "./Dropdown";
import type Lang from "../interfaces/Lang";
import type IdText from "../interfaces/IdText";
import switchIcon from "../assets/switch-horizontal.svg";

function clipText(text: string) {
    const maxLength = 20;
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text;
}

function TopBar({
  selectedText,
  fromLangs,
  toLangs,
}: {
  selectedText: string | null;
  fromLangs: Array<Lang>;
  toLangs: Array<Lang>;
}) {
  const [fromLang, setFromLang] = useState<Lang | null>(fromLangs[0]);
  const [toLang, setToLang] = useState<Lang | null>(toLangs[0]);

  const fromLangOptions: Array<IdText> = useMemo(() => {
    return fromLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [fromLangs]);

  const toLangOptions: Array<IdText> = useMemo(() => {
    return toLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [toLangs]);

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
  const onSwitchButtonClick = useCallback(() => {
    setFromLang(toLang);
    setToLang(fromLang);
  }, [setFromLang, setToLang, fromLang, toLang]);

  return (
    <div className="bg-stone-800 w-full flex justify-center items-center py-1.5 h-10">
      <div className="flex-1 text-stone-500 px-4 py-2">
        {selectedText != null && selectedText.length > 0
          ? `Selected: ${clipText(selectedText)}`
          : ""}
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Dropdown
          className="bg-stone-900 rounded text-white p-1 w-25 focus:outline-none mx-2"
          onSelect={onFromLangSelect}
          options={fromLangOptions}
          value={fromLang?.lang ?? "-"}
        />
        <button
          onClick={onSwitchButtonClick}
          className="p-1 rounded-md cursor-pointer hover:bg-stone-400"
        >
          <img className="text-white w-4 h-4" src={switchIcon} />
        </button>
        <Dropdown
          className="bg-stone-900 rounded text-white p-1 w-25 focus:outline-none mx-2"
          onSelect={onToLangSelect}
          options={toLangOptions}
          value={toLang?.lang ?? "-"}
        />
      </div>
      <div className="flex-1"></div>
    </div>
  );
}

export default TopBar;
