import { useCallback, useEffect, useMemo, useState, type SetStateAction } from "react";
import MainContent from "./components/MainContent";
import TopBar from "./components/TopBar";
import type { PageType } from "./types/PageType";
import MainPage from "./components/MainPage";
import SettingPage from "./components/SettingPage";
import ExplainPage from "./components/ExplainPage";
import type SourceProvider from "../interfaces/SourceProvider";
import type Translator from "../interfaces/Translator";
import type Explainer from "../interfaces/Explainer";
import axios from "axios";
import type Lang from "../interfaces/Lang";

async function fetchSourceProviders(
  setSourceProviders: React.Dispatch<React.SetStateAction<SourceProvider[]>>,
  setCurrentSourceProvider: React.Dispatch<React.SetStateAction<SourceProvider | null>>) {
  try {
    const res = await axios.get("/api/sourceProviders");
    const providers: Array<SourceProvider> = res.data;
    setSourceProviders(providers);
    const currentProvider = providers[0];
    setCurrentSourceProvider(currentProvider);
  } catch (err: any) {
    console.error(err);
  }
}
async function fetchTranslators(
  setTranslators: React.Dispatch<React.SetStateAction<Translator[]>>,
  setCurrentTranslator: React.Dispatch<React.SetStateAction<Translator | null>>) {
  try {
    const res = await axios.get("/api/translators");
    const translators: Array<Translator> = res.data;
    setTranslators(translators);
    const currentTranslator = translators[0];
    setCurrentTranslator(currentTranslator);
  } catch (err: any) {
    console.error(err);
  }
}
async function fetchExplainers(
  setExplainers: React.Dispatch<React.SetStateAction<Explainer[]>>,
  setCurrentExplainer: React.Dispatch<React.SetStateAction<Explainer | null>>) {
  try {
    const res = await axios.get("/api/explainers");
    const explainers: Array<Explainer> = res.data;
    setExplainers(explainers);
    const currentExplainer = explainers[0];
    setCurrentExplainer(currentExplainer);
  } catch (err: any) {
    console.error(err);
  }
}

function Mobile() {
  const [pageType, setPageType] = useState<PageType>("main");
  const [isSetting, setIsSetting] = useState<boolean>(false);

  const [sourceProviders, setSourceProviders] = useState<Array<SourceProvider>>(
    [],
  );
  const [translators, setTranslators] = useState<Array<Translator>>([]);
  const [explainers, setExplainers] = useState<Array<Explainer>>([]);

  const [currentSourceProvider, setCurrentSourceProvider] =
    useState<SourceProvider | null>(null);
  const [currentTranslator, setCurrentTranslator] = useState<Translator | null>(
    null,
  );
  const [currentExplainer, setCurrentExplainer] = useState<Explainer | null>(
    null,
  );

  const [currentFromLang, setCurrentFromLang] = useState<Lang | null>(null);
  const [currentToLang, setCurrentToLang] = useState<Lang | null>(null);
  const [generatedText, setGeneratedText] = useState<string>("");

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
    if (pageType === "main") {
      onMainClick();
    } else if (pageType === "explain") {
      onExplainClick();
    }
  }, [pageType, onMainClick, onExplainClick]);

  const page = useMemo(() => {
    if (isSetting)
      return (
        <SettingPage
          onDoneClick={onDoneClick}
          sourceProviders={sourceProviders}
          translators={translators}
          explainers={explainers}
          currentSourceProvider={currentSourceProvider}
          currentTranslator={currentTranslator}
          currentExplainer={currentExplainer}
          setCurrentSourceProvider={setCurrentSourceProvider}
          setCurrentTranslator={setCurrentTranslator}
          setCurrentExplainer={setCurrentExplainer}
        />
      );
    switch (pageType) {
      case "main":
        return <MainPage currentFromLang={currentFromLang?.lang ?? null} currentToLang={currentToLang?.lang ?? null} currentSourceProviderId={currentSourceProvider?.id ?? ""} generatedText={generatedText} setGeneratedText={setGeneratedText} />;
      case "explain":
        return <ExplainPage />;
    }
  }, [
    onDoneClick,
    pageType,
    isSetting,
    sourceProviders,
    translators,
    explainers,
    currentSourceProvider,
    currentTranslator,
    currentExplainer,
    currentFromLang,
    currentToLang,
    generatedText,
  ]);

  useEffect(() => {
    fetchSourceProviders(setSourceProviders, setCurrentSourceProvider);
    fetchTranslators(setTranslators, setCurrentTranslator);
    fetchExplainers(setExplainers, setCurrentExplainer);
  }, []);

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
