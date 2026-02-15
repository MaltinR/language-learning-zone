import { useCallback } from "react";
import backIcon from "../../assets/back.svg";
import messageIcon from "../../assets/message.svg";
import settingIcon from "../../assets/setting.svg";
import type { PageType } from "../types/PageType";

function TopBar({
  pageType,
  isSetting,
  onMainClick,
  onSettingClick,
  onExplainClick,
}: {
  pageType: PageType;
  isSetting: boolean;
  onMainClick: () => void;
  onSettingClick: () => void;
  onExplainClick: () => void;
}) {
    const onSettingButtonClick = useCallback(() => {
        console.log(pageType, isSetting);
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
    }, [pageType, isSetting]);

  return (
    <div className="bg-stone-800 h-12 flex justify-center items-center px-3 py-2">
      {pageType === "explain" ? (
        <Image onClick={onMainClick} src={backIcon} />
      ) : (
        <Image onClick={onExplainClick} src={messageIcon} />
      )}
      <div className="text-center flex-1">TopBar</div>
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
