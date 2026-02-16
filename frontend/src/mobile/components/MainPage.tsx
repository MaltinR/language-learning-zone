import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Area from "./Area";
import BottomBar from "./BottomBar";
import Source from "./Source";
import Translator from "./Translator";
import type NextRequest from "../../interfaces/source/NextRequest";
import type NextResponse from "../../interfaces/source/NextResponse";
import type Translation from "../../interfaces/translator/Translation";
import type Lang from "../../interfaces/Lang";
import type TranslateResponse from "../../interfaces/translator/TranslateResponse";
import type SourceProvider from "../../interfaces/SourceProvider";
import type { default as TranslatorType } from "../../interfaces/Translator";

function MainPage({
  currentFromLang,
  currentToLang,
  currentSourceProvider,
  currentTranslator,
  generatedText,
  targetText,
  translations,
  setGeneratedText,
  setTargetText,
  setTranslations,
}: {
  currentFromLang: Lang | null;
  currentToLang: Lang | null;
  currentSourceProvider: SourceProvider | null;
  currentTranslator: TranslatorType | null;
  generatedText: string;
  targetText: string;
  translations: Array<Translation>;
  setGeneratedText: React.Dispatch<React.SetStateAction<string>>;
  setTargetText: React.Dispatch<React.SetStateAction<string>>;
  setTranslations: React.Dispatch<React.SetStateAction<Translation[]>>;
}) {
  const [isNextFetching, setIsNextFetching] = useState<boolean>(false);
  const [isTranslateFetching, setIsTranslateFetching] =
    useState<boolean>(false);

  const isSourceProviderSupported = useMemo(() => {
    return currentSourceProvider?.langs.some((el) => el.lang === currentFromLang?.lang) ?? false
  }, [currentSourceProvider, currentFromLang])

  const isTranslatorSupported = useMemo(() => {
    return currentTranslator?.fromLangs.some((el) => el.lang === currentFromLang?.lang) ?? false
  }, [currentTranslator, currentFromLang])

  const nextClickable = useMemo(() => {
    return !isNextFetching && isSourceProviderSupported;
  }, [isNextFetching, isSourceProviderSupported]);

  const translateClickable = useMemo(() => {
    return !isTranslateFetching && isTranslatorSupported && targetText.length > 0;
  }, [isTranslateFetching, isTranslatorSupported, targetText]);

  const onNextClick = useCallback(async () => {
    if (isNextFetching) return;
    try {
      setIsNextFetching(true);

      const body: NextRequest = {
        lang: currentFromLang?.lang ?? "en",
      };
      const res = await axios.post(
        `/api/sourceProviders/${currentSourceProvider!.id}/next`,
        body,
      );
      const data: NextResponse = res.data;
      setGeneratedText(data.result);
    } catch (err: any) {
      console.error(err);
      window.alert("Error occurred while fetching next source");
    } finally {
      setIsNextFetching(false);
    }
  }, [
    setGeneratedText,
    currentFromLang,
    currentSourceProvider,
    isNextFetching,
  ]);

  const onTranslateClick = useCallback(async () => {
    if (isTranslateFetching) return;
    try {
      setIsTranslateFetching(true);
      // Execute translate
      const translationResponses = await Promise.all(
        translations.map((el) => {
          const body = {
            text: targetText,
            fromLang: currentFromLang!.lang,
            toLang: el.toLang,
          };
          return axios.post(
            `/api/translators/${currentTranslator!.id}/translate`,
            body,
          );
        }),
      );
      const newTranslations: Array<Translation> = translationResponses.map(
        (res, i) => {
          // console.log(res.data);
          const data: TranslateResponse = res.data;
          return {
            toLang: translations.find((_, index) => index === i)!.toLang,
            translation: data.result,
          };
        },
      );
      setTranslations((_translations) =>
        _translations.map((item) => {
          return {
            ...item,
            translation:
              newTranslations.find((el) => el.toLang === item.toLang)
                ?.translation ?? "",
          };
        }),
      );
    } catch (err: any) {
      console.error(err);
      window.alert("Error occurred, make sure original language and target language are different");
    } finally {
      setIsTranslateFetching(false);
    }
  }, [
    setTranslations,
    translations,
    currentFromLang,
    currentTranslator,
    isTranslateFetching,
    targetText,
  ]);

  useEffect(() => {
    // TODO: If not copied
    setTargetText(generatedText);
  }, [setTargetText, generatedText]);

  return (
    <div className="flex h-full w-full flex-col min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <Area className="min-h-2/5">
          <Source
            isSupported={isSourceProviderSupported}
            text={generatedText}
            isFetching={isNextFetching}
            setText={setGeneratedText}
          />
        </Area>
        <Area className="h-3/5 mt-0 min-h-0">
          <Translator
            translator={currentTranslator}
            isSupported={isTranslatorSupported}
            toLang={currentToLang}
            isFetching={isTranslateFetching}
            translations={translations}
            setTranslations={setTranslations}
          />
        </Area>
      </div>
      <BottomBar className="mx-1 mb-2">
        <div className="flex-1 flex justify-center items-center h-full">
          <Button disabled={!nextClickable} className="flex-1 mx-1 h-full" onClick={onNextClick}>
            Next
          </Button>
          <Button disabled={!translateClickable} className="flex-1 mx-1 h-full" onClick={onTranslateClick}>
            Translate
          </Button>
        </div>
      </BottomBar>
    </div>
  );
}

export default MainPage;
