import { useCallback, useMemo } from "react";
import backIcon from "../../assets/back.svg";
import messageIcon from "../../assets/message.svg";
import settingIcon from "../../assets/setting.svg";
import type { PageType } from "../types/PageType";
import type Lang from "../../interfaces/Lang";
import Dropdown from "../../components/Dropdown";
import type IdText from "../../interfaces/IdText";
import switchIcon from "../../assets/switch-horizontal.svg";

function TopBar({
  pageType,
  isSetting,
  fromLangs,
  toLangs,
  fromLang,
  toLang,
  setFromLang,
  setToLang,
  onMainClick,
  onSettingClick,
  onExplainClick,
}: {
  pageType: PageType;
  isSetting: boolean;
  fromLangs: Array<Lang>;
  toLangs: Array<Lang>;
  fromLang: Lang | null,
  toLang: Lang | null,
  setFromLang: React.Dispatch<React.SetStateAction<Lang | null>>,
  setToLang: React.Dispatch<React.SetStateAction<Lang | null>>,
  onMainClick: () => void;
  onSettingClick: () => void;
  onExplainClick: () => void;
}) {

  const fromLangOptions: Array<IdText> = useMemo(() => {
    return fromLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [fromLangs]);

  const toLangOptions: Array<IdText> = useMemo(() => {
    return toLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [toLangs]);

  const onFromLangSelectInternal = useCallback(
    (id: string) => {
      setFromLang(fromLangs.find((lang) => lang.lang === id)!);
    },
    [setFromLang, fromLangs],
  );
  const onToLangSelectInternal = useCallback(
    (id: string) => {
      setToLang(toLangs.find((lang) => lang.lang === id)!);
    },
    [setToLang, toLangs],
  );
  const onSwitchButtonClick = useCallback(() => {
    setFromLang(toLang);
    setToLang(fromLang);
  }, [setFromLang, setToLang, fromLang, toLang]);

    const onSettingButtonClick = useCallback(() => {
        if (!isSetting)
        {
            onSettingClick();
            return;
        }
        if (pageType === "main")
        {
            onMainClick();
        }
        else if (pageType === "explain"){
            onExplainClick();
        }
    }, [isSetting, pageType, onSettingClick, onMainClick, onExplainClick]);

    console.log(fromLang);
    console.log(toLang);

  return (
    <div className="bg-stone-800 h-12 flex justify-center items-center px-3 py-2">
      {pageType === "explain" ? (
        <Image onClick={onMainClick} src={backIcon} />
      ) : (
        <Image onClick={onExplainClick} src={messageIcon} />
      )}
      <div className="flex-1 flex justify-center items-center">
        <Dropdown
          className="bg-stone-900 rounded text-white p-1 w-25 focus:outline-none mx-2"
          onSelect={onFromLangSelectInternal}
          options={fromLangOptions}
          value={fromLang?.lang ?? "-"}
        />
        <button
          onClick={onSwitchButtonClick}
          className="p-1 rounded-md cursor-pointer hover:bg-stone-400"
        >
          <img className="w-4 h-4" src={switchIcon} />
        </button>
        <Dropdown
          className="bg-stone-900 rounded text-white p-1 w-25 focus:outline-none mx-2"
          onSelect={onToLangSelectInternal}
          options={toLangOptions}
          value={toLang?.lang ?? "-"}
        />
      </div>
      <Image onClick={onSettingButtonClick} src={settingIcon} />
    </div>
  );
}

function Image({
  src,
  className,
  onClick,
}: {
  src: string;
  className?: string;
  onClick?: () => void;
}) {
  return <img onClick={onClick} className={"h-6 w-6 " + className} src={src} />;
}

export default TopBar;
