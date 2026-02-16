import { useCallback, useEffect, useMemo, useState } from "react";
import TranslationRow from "../../components/TranslationRow";
import type Lang from "../../interfaces/Lang";
import type Translation from "../../interfaces/translator/Translation";
import type { default as TranslatorType } from "../../interfaces/Translator";

function newTranslation(lang: string): Translation {
  return {
    toLang: lang,
    translation: "",
  };
}

function Translator({
  translator,
  fromLang,
  toLang,
  isFetching,
  translations,
  setTranslations,
}: {
  translator: TranslatorType | null;
  fromLang: Lang | null;
  toLang: Lang | null;
  isFetching: boolean;
  translations: Array<Translation>;
  setTranslations: React.Dispatch<React.SetStateAction<Translation[]>>;
}) {
  const [lastToLang, setLastToLang] = useState<string | null>(null);
  // Warning if not available

  const options = useMemo(() => {
    return (
      translator?.toLangs.map((lang) => ({ id: lang.lang, text: lang.name })) ??
      []
    );
  }, [translator]);

  const inUseToLangs: Array<string> = useMemo(() => {
    return translations.map((translation) => translation.toLang);
  }, [translations]);

  const onButtonClick = useCallback(() => {
    setTranslations((translators) => {
      return [
        ...translators,
        {
          toLang: translator!.toLangs.find(
            (lang) => !inUseToLangs.includes(lang.lang),
          )!.lang,
          translation: "",
        },
      ];
    });
  }, [setTranslations, translator, inUseToLangs]);

  const onUpdatedToLangUpdated = useCallback(
    (updatedToLang: string | null) => {
      if (updatedToLang == null || updatedToLang === lastToLang) return;

      const toLang = translator?.toLangs.find(
        (lang) => lang.lang === updatedToLang,
      );
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
    [lastToLang, translator, translations, setTranslations],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onUpdatedToLangUpdated(toLang?.lang ?? null);
  }, [onUpdatedToLangUpdated, toLang?.lang]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-center items-center">
        <div className="text-center font-semibold my-2">Translate</div>
      </div>

      {!translator?.fromLangs.some((el) => el.lang === fromLang?.lang) ? (
        <div className="flex-1 flex p-4 items-center">
          <div className="flex-1 text-stone-500 text-wrap text-center">
            <div>Current translator doesn't support</div>
            <div>the original language</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div
            className={`text-white flex-1 flex flex-col rounded-md border-2 ${isFetching ? "border-emerald-600" : "border-stone-900"}`}
          >
            <div className="flex-1 flex flex-col">
              {translations.map((el, index) => (
                <TranslationRow
                  key={index}
                  options={options}
                  value={el.toLang}
                  translation={el.translation}
                  onSelect={(lang) => {
                    setTranslations((translators) =>
                      translators.map((el, i) =>
                        index !== i ? el : { ...el, toLang: lang },
                      ),
                    );
                  }}
                  onRemoveClick={() =>
                    setTranslations((translators) =>
                      translators.filter((_, i) => index !== i),
                    )
                  }
                />
              ))}
              {translator != null && translations.length < options.length && (
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
      )}
    </div>
  );
}

export default Translator;
