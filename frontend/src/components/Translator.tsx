import { useCallback, useEffect, useMemo, useState } from "react";
import Dropdown from "./Dropdown";
import type Lang from "../interfaces/Lang";
import type IdText from "../interfaces/IdText";
import axios from "axios";
import Button from "./Button";
import TranslationRow from "./TranslationRow";
import TextDropdown from "./TextDropdown";

async function initFetch(
  setTranslators: React.Dispatch<React.SetStateAction<Translator[]>>,
  setCurrentTranslator: React.Dispatch<React.SetStateAction<Translator | null>>,
  // setFromLangs: React.Dispatch<React.SetStateAction<Array<Lang>>>,
  // setToLangs: React.Dispatch<React.SetStateAction<Array<Lang>>>,
) {
  try {
    const res = await axios.get("/api/translators");
    // console.log(res.data);
    const translators: Array<Translator> = res.data;
    const translator = translators[0];
    setTranslators(translators);
    setCurrentTranslator(translator);
    // setFromLangs(translator.fromLangs);
    // setToLangs(translator.toLangs);
  } catch (err: any) {
    console.error(err);
  }
}

function newTranslation(lang: string): Translation {
  return {
    toLang: lang,
    translation: "",
  };
}

interface Translator {
  id: string;
  name: string;
  fromLangs: Array<Lang>;
  toLangs: Array<Lang>;
}

interface Translation {
  toLang: string;
  translation: string;
}

interface TranslateResponse {
  result: string;
}

function Translator({
  text,
  updatedFromLang,
  updatedToLang,
}: {
  text: string;
  updatedFromLang: string | null;
  updatedToLang: string | null;
}) {
  const [translators, setTranslators] = useState<Array<Translator>>([]);
  const [fromLangs, setFromLangs] = useState<Array<Lang>>([]);
  const [toLangs, setToLangs] = useState<Array<Lang>>([]);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [currentTranslator, setCurrentTranslator] = useState<Translator | null>(
    null,
  );
  const [fromLang, setFromLang] = useState<Lang | null>(null);
  //   const [toLang, setToLang] = useState<Lang | null>(null);

  const [translations, setTranslations] = useState<Array<Translation>>([]);
  const [lastToLang, setLastToLang] = useState<string | null>(null);
  // const [lastRemoveLang, setLastRemoveLang] = useState<string | null>(null);

  const translatorOptions: Array<IdText> = useMemo(() => {
    return translators.map((translator) => ({
      id: translator.id,
      text: translator.name,
    }));
  }, [translators]);

  const fromLangOptions: Array<IdText> = useMemo(() => {
    return fromLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [fromLangs]);

  const toLangOptions: Array<IdText> = useMemo(() => {
    return toLangs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [toLangs]);

  const inUseToLangs: Array<string> = useMemo(() => {
    return translations.map((translation) => translation.toLang);
  }, [translations]);

  const onClick = useCallback(async () => {
    if (isFetching || text === "") return;
    try {
      setIsFetching(true);
      // TODO: Execute translate
      const translationResponses = await Promise.all(
        translations.map((el) => {
          const body = {
            text,
            fromLang: fromLang!.lang,
            toLang: el.toLang,
          };
          // console.log(body);
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
    } finally {
      setIsFetching(false);
    }
  }, [
    setIsFetching,
    setTranslations,
    isFetching,
    translations,
    currentTranslator,
    fromLang,
    text,
  ]);

  const onTranslatorSelect = useCallback(
    (id: string) => {
      return setCurrentTranslator(
        translators.find((sourceProvider) => sourceProvider.id == id)!,
      );
    },
    [setCurrentTranslator, translators],
  );

  const onFromLangSelect = useCallback(
    (id: string) => {
      setFromLang(fromLangs.find((lang) => lang.lang === id)!);
    },
    [setFromLang, fromLangs],
  );

  const onButtonClick = useCallback(() => {
    setTranslations((translators) => {
      // console.log(
      //   `Next: ${toLangs.find((lang) => !inUseToLangs.includes(lang.lang))!.lang}`,
      // );
      return [
        ...translators,
        {
          toLang: toLangs.find((lang) => !inUseToLangs.includes(lang.lang))!
            .lang,
          translation: "",
        },
      ];
    });
  }, [setTranslations, toLangs, inUseToLangs]);

  const onUpdatedToLangUpdated = useCallback(
    (updatedToLang: string | null) => {
      if (updatedToLang == null || updatedToLang === lastToLang) return;

      const toLang = toLangs.find((lang) => lang.lang === updatedToLang);
      if (toLang == null) return;

      // Check if translation has it, if not, add
      if (!translations.some((el) => el.toLang === updatedToLang)) {
        // Check if has previous
        if (translations.some((el) => el.toLang === lastToLang)) {
          setTranslations((items) =>
            items.map((el) =>
              el.toLang === lastToLang ? newTranslation(updatedToLang) : el,
            ),
          );
        } else {
          setTranslations((items) => [...items, newTranslation(updatedToLang)]);
        }
      }

      setLastToLang(updatedToLang);
    },
    [setTranslations, toLangs, translations, lastToLang],
  );

  useEffect(() => {
    initFetch(setTranslators, setCurrentTranslator);
  }, []);

  useEffect(() => {
    if (updatedFromLang == null) return;
    const fromLang = fromLangs.find((lang) => lang.lang === updatedFromLang);
    if (fromLang == null) return;
    setFromLang(fromLang);
  }, [setFromLang, updatedFromLang, fromLangs]);

  useEffect(() => {
    onUpdatedToLangUpdated(updatedToLang);
  }, [onUpdatedToLangUpdated, updatedToLang]);

  useEffect(() => {
    if (currentTranslator == null) return;
    setFromLangs(currentTranslator.fromLangs);
    setToLangs(currentTranslator.toLangs);
  }, [currentTranslator]);

  return (
    <div className="flex-1 h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="border-b-2 flex flex-row justify-between items-center shrink-0">
        <div className="text-white px-6 py-3 font-bold text-xl">Translator</div>
        <div className="pr-4 flex flex-wrap items-center">
          <Dropdown
            className="bg-stone-800 rounded text-white p-1 w-w-25 focus:outline-none mx-2"
            onSelect={onTranslatorSelect}
            options={translatorOptions}
            value={currentTranslator?.id ?? "-"}
          />
          <TextDropdown
            name={"From"}
            onSelect={onFromLangSelect}
            options={fromLangOptions}
            value={fromLang?.lang ?? "-"}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div
          className={`text-white flex-1 flex flex-col border-2 ${isFetching ? "border-emerald-600" : "border-stone-900"}`}
        >
          <div className="flex flex-col flex-1 items-center mx-2 mt-2">
            {translations.map((_, index) => (
              <TranslationRow
                key={index}
                options={toLangOptions}
                value={translations[index].toLang}
                translation={translations[index].translation}
                onSelect={(lang) => {
                  setTranslations((translators) =>
                    translators.map((el, i) =>
                      index !== i ? el : { ...el, toLang: lang },
                    ),
                  );
                  // setLastRemoveLang(lang);
                }}
                onRemoveClick={() =>
                  setTranslations((translators) =>
                    translators.filter((_, i) => index !== i),
                  )
                }
              />
            ))}

            {translations.length < toLangs.length && (
              <button
                className="bg-stone-700 w-full text-3xl rounded-md text-center cursor-pointer focus:outline-none hover:bg-stone-800"
                onClick={onButtonClick}
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex px-6 py-3 justify-center mb-1 border-t-2">
        <div className="flex-1" />
        <Button className="flex-1" onClick={onClick}>
          Translate
        </Button>
        <div className="flex-1" />
      </div>
    </div>
  );
}

export default Translator;
