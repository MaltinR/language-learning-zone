import { useCallback, useMemo, useState } from "react";
import MainContent from "./components/MainContent";
import TopBar from "./components/TopBar";
import type { PageType } from "./types/PageType";
import MainPage from "./components/MainPage";
import SettingPage from "./components/SettingPage";
import ExplainPage from "./components/ExplainPage";

function Mobile() {
  const [pageType, setPageType] = useState<PageType>("main");
  const [isSetting, setIsSetting] = useState<boolean>(false);

  const onMainClick = useCallback(() => {
    setIsSetting(false);
    setPageType("main");
  }, []);
  const onSettingClick = useCallback(() => {
    setIsSetting(true);
  }, []);
  const onExplainClick = useCallback(() => {
    setIsSetting(false);
    setPageType("explain");
  }, []);

  const onDoneClick = useCallback(() => {
    if (pageType === "main") 
    {
        onMainClick();
    }
    else if (pageType === "explain") {
        onExplainClick();
    }
  }, [pageType, onMainClick, onExplainClick]);

  const page = useMemo(() => {
    if (isSetting) return <SettingPage onDoneClick={onDoneClick} />;
    switch (pageType) {
      case "main":
        return <MainPage />;
      case "explain":
        return <ExplainPage />;
    }
  }, [pageType, isSetting]);

  return (
    <div className="bg-stone-900 w-screen h-screen flex flex-col">
      <TopBar
        pageType={pageType}
        isSetting={isSetting}
        onMainClick={onMainClick}
        onSettingClick={onSettingClick}
        onExplainClick={onExplainClick}
      />
      <MainContent>{page}</MainContent>
    </div>
  );
}

export default Mobile;
