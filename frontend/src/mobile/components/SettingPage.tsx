import { useCallback, useMemo } from "react";
import Button from "../../components/Button";
import type Explainer from "../../interfaces/Explainer";
import type SourceProvider from "../../interfaces/SourceProvider";
import type Translator from "../../interfaces/Translator";
import BottomBar from "./BottomBar";
import SettingItem from "./SettingItem";
import type IdText from "../../interfaces/IdText";

function SettingPage({
  onDoneClick,
  sourceProviders,
  translators,
  explainers,
  currentSourceProvider,
  currentTranslator,
  currentExplainer,
  setCurrentSourceProvider,
  setCurrentTranslator,
  setCurrentExplainer,
}: {
  onDoneClick: () => void;
  sourceProviders: Array<SourceProvider>;
  translators: Array<Translator>;
  explainers: Array<Explainer>;
  currentSourceProvider: SourceProvider | null,
  currentTranslator: Translator | null,
  currentExplainer: Explainer | null,
  setCurrentSourceProvider:React.Dispatch<React.SetStateAction<SourceProvider | null>>;
  setCurrentTranslator:React.Dispatch<React.SetStateAction<Translator | null>>;
  setCurrentExplainer:React.Dispatch<React.SetStateAction<Explainer | null>>;
}) {
  const sourceProviderOptions : Array<IdText> = useMemo(() => {
    return sourceProviders.map(el => ({
      id: el.id,
      text: el.name,
    }));
  }, [sourceProviders])

  const translatorOptions : Array<IdText> = useMemo(() => {
    return translators.map(el => ({
      id: el.id,
      text: el.name,
    }));
  }, [translators])

  const explainerOptions : Array<IdText> = useMemo(() => {
    return explainers.map(el => ({
      id: el.id,
      text: el.name,
    }));
  }, [explainers])

  const setSourceProvider = useCallback((id: string) => {
    setCurrentSourceProvider(sourceProviders.find(el => el.id === id) ?? null);
  }, [setCurrentSourceProvider, sourceProviders]);

  const setTranslator = useCallback((id: string) => {
    setCurrentTranslator(translators.find(el => el.id === id) ?? null);
  }, [setCurrentTranslator, translators]);

  const setExplainer = useCallback((id: string) => {
    setCurrentExplainer(explainers.find(el => el.id === id) ?? null);
  }, [setCurrentExplainer, explainers]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 flex flex-col items-center px-2">
        <SettingItem title="Source" items={sourceProviderOptions} current={currentSourceProvider?.id ?? null} setter={setSourceProvider}/>
        <SettingItem title="Translator" items={translatorOptions} current={currentTranslator?.id ?? null} setter={setTranslator}/>
        <SettingItem title="Explainer" items={explainerOptions} current={currentExplainer?.id ?? null} setter={setExplainer}/>
      </div>
      <BottomBar className="mx-1 mb-2">
        <div className="flex-1 flex justify-center items-center h-full">
          <Button className="flex-1 mx-1 h-full" onClick={onDoneClick}>
            Done
          </Button>
        </div>
      </BottomBar>
    </div>
  );
}

export default SettingPage;
