import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import MainContent from "./components/MainContent";
import TopBar from "./components/TopBar";
import MainPage from "./components/MainPage";
import SettingPage from "./components/SettingPage";
import ExplainPage from "./components/ExplainPage";
import type { PageType } from "./types/PageType";
import type SourceProvider from "../interfaces/SourceProvider";
import type Translator from "../interfaces/Translator";
import type Explainer from "../interfaces/Explainer";
import type Lang from "../interfaces/Lang";
import type MessageData from "../interfaces/MessageData";
import type Translation from "../interfaces/translator/Translation";

function getDefaultLang(langs: Array<Lang>): Lang {
  return (
    langs.find((lang) => lang.lang == "en") ??
    langs.find((lang) => lang.lang.startsWith("en")) ??
    langs[0]
  );
}

async function fetchSourceProviders(
  setSourceProviders: React.Dispatch<React.SetStateAction<SourceProvider[]>>,
  setCurrentSourceProvider: React.Dispatch<
    React.SetStateAction<SourceProvider | null>
  >,
) {
  try {
    const res = await axios.get("/api/sourceProviders");
    const providers: Array<SourceProvider> = res.data;
    setSourceProviders(providers);
    const currentProvider = providers[0];
    setCurrentSourceProvider(currentProvider);
  } catch (err: any) {
    console.error(err);
    window.alert("Error occurred while fetching source provider list");
  }
}
async function fetchTranslators(
  setTranslators: React.Dispatch<React.SetStateAction<Translator[]>>,
  setCurrentTranslator: React.Dispatch<React.SetStateAction<Translator | null>>,
) {
  try {
    const res = await axios.get("/api/translators");
    const translators: Array<Translator> = res.data;
    setTranslators(translators);
    const currentTranslator = translators[0];
    setCurrentTranslator(currentTranslator);
  } catch (err: any) {
    console.error(err);
    window.alert("Error occurred while fetching translator list");
  }
}
async function fetchExplainers(
  setExplainers: React.Dispatch<React.SetStateAction<Explainer[]>>,
  setCurrentExplainer: React.Dispatch<React.SetStateAction<Explainer | null>>,
) {
  try {
    const res = await axios.get("/api/explainers");
    const explainers: Array<Explainer> = res.data;
    setExplainers(explainers);
    const currentExplainer = explainers[0];
    setCurrentExplainer(currentExplainer);
  } catch (err: any) {
    console.error(err);
    window.alert("Error occurred while fetching explainer list");
  }
}

function Mobile({
  fromLangs,
  toLangs,
}: {
  fromLangs: Array<Lang>;
  toLangs: Array<Lang>;
}) {
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

  const [currentFromLang, setCurrentFromLang] = useState<Lang | null>(
    getDefaultLang(fromLangs),
  );
  const [currentToLang, setCurrentToLang] = useState<Lang | null>(
    getDefaultLang(toLangs),
  );
  const [generatedText, setGeneratedText] = useState<string>("");
  const [targetText, setTargetText] = useState<string>("");

  const [translations, setTranslations] = useState<Array<Translation>>([]);
  const [messages, setMessages] = useState<Array<MessageData>>([]);

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
        return (
          <MainPage
            currentFromLang={currentFromLang}
            currentToLang={currentToLang}
            currentSourceProvider={currentSourceProvider}
            currentTranslator={currentTranslator}
            generatedText={generatedText}
            targetText={targetText}
            translations={translations}
            setGeneratedText={setGeneratedText}
            setTargetText={setTargetText}
            setTranslations={setTranslations}
          />
        );
      case "explain":
        return (
          <ExplainPage
            explainer={currentExplainer}
            text={targetText}
            fromLang={currentFromLang}
            toLang={currentToLang}
            messages={messages}
            setMessages={setMessages}
          />
        );
    }
  }, [
    isSetting,
    onDoneClick,
    sourceProviders,
    translators,
    explainers,
    currentSourceProvider,
    currentTranslator,
    currentExplainer,
    pageType,
    currentFromLang,
    currentToLang,
    generatedText,
    targetText,
    translations,
    messages,
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
        fromLangs={fromLangs}
        toLangs={toLangs}
        fromLang={currentFromLang}
        toLang={currentToLang}
        setFromLang={setCurrentFromLang}
        setToLang={setCurrentToLang}
      />
      <MainContent>{page}</MainContent>
    </div>
  );
}

export default Mobile;
