import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";
import type IdText from "../interfaces/IdText";
import type Lang from "../interfaces/Lang";

async function initFetch(
  setSourceProviders: React.Dispatch<React.SetStateAction<SourceProvider[]>>,
  setLangs: React.Dispatch<React.SetStateAction<Lang[]>>,
  setCurrentSourceProvider: React.Dispatch<
    React.SetStateAction<SourceProvider | null>
  >,
) {
  try {
    const res = await axios.get("/api/sourceProviders");
    // console.log(res.data);
    const providers: Array<SourceProvider> = res.data;
    setSourceProviders(providers);
    const currentProvider = providers[0];
    setCurrentSourceProvider(currentProvider);
    setLangs(currentProvider.langs);
  } catch (err: any) {
    console.error(err);
  }
}

interface SourceProvider {
  id: string;
  name: string;
  langs: Array<Lang>;
}

interface NextRequest {
  lang: string;
}

interface NextResponse {
  input: {
    lang: string;
  };
  sourceProvider: {
    id: string;
    name: string;
  };
  result: string;
}

function Source({ onTextUpdated }: { onTextUpdated: (text: string) => void }) {
  const [sourceProviders, setSourceProviders] = useState<Array<SourceProvider>>(
    [],
  );
  const [generatedText, setGeneratedText] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [langs, setLangs] = useState<Array<Lang>>([]);
  const [currentSourceProvider, setCurrentSourceProvider] =
    useState<SourceProvider | null>(null);
  const [currentLang, setCurrentLang] = useState<Lang | null>(null);

  const sourceProviderOptions: Array<IdText> = useMemo(() => {
    return sourceProviders.map((sourceProvider) => ({
      id: sourceProvider.id,
      text: sourceProvider.name,
    }));
  }, [sourceProviders]);

  const langOptions: Array<IdText> = useMemo(() => {
    return langs.map((lang) => ({ id: lang.lang, text: lang.name }));
  }, [langs]);

  const onClick = useCallback(async () => {
    if (isFetching) return;
    try {
      setIsFetching(true);
      const body: NextRequest = {
        lang: currentLang?.lang ?? "en",
      };
      const res = await axios.post(
        `/api/sourceProviders/${currentSourceProvider?.id}/next`,
        body,
      );
      const data: NextResponse = res.data;
      setGeneratedText(data.result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [
    setIsFetching,
    setGeneratedText,
    isFetching,
    currentLang,
    currentSourceProvider,
  ]);

  const onSourceProviderSelect = useCallback(
    (id: string) => {
      return setCurrentSourceProvider(
        sourceProviders.find((sourceProvider) => sourceProvider.id == id)!,
      );
    },
    [setCurrentSourceProvider, sourceProviders],
  );

  const onLangSelect = useCallback(
    (id: string) => {
      return setCurrentLang(langs.find((lang) => lang.lang == id)!);
    },
    [setCurrentLang, langs],
  );

  const onTextChange = useCallback(
    (value: string) => {
      return setGeneratedText(value);
    },
    [setGeneratedText],
  );

  useEffect(() => {
    initFetch(setSourceProviders, setLangs, setCurrentSourceProvider);
  }, []);

  useEffect(() => {
    onTextUpdated(generatedText);
  }, [generatedText]);

  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="border-b-2 flex flex-row justify-between items-center">
        <div className="text-white px-6 py-3 font-bold text-xl">Source</div>
        <div className="pr-4 flex flex-wrap items-center">
          <Dropdown
            className="bg-stone-800 rounded text-white p-1 w-25 focus:outline-none mx-2"
            onSelect={onSourceProviderSelect}
            options={sourceProviderOptions}
            value={currentSourceProvider?.id ?? ""}
          />
          <Dropdown
            className="bg-stone-800 rounded text-white p-1 w-25 focus:outline-none"
            onSelect={onLangSelect}
            options={langOptions}
            value={currentLang?.lang ?? ""}
          />
        </div>
      </div>
      <div className="flex-1 px-6 py-3 flex flex-col justify-between">
        <div className="text-white flex-1 flex">
          <div
            className={`bg-stone-800 flex flex-1 mt-2 mb-4 rounded-md border-2 ${isFetching ? "text-emerald-600" : "text-stone-800"}`}
          >
            <textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onTextChange(e.target.value)
              }
              draggable={false}
              placeholder="Click 'Next' to generate text"
              className="py-2 px-4 text-white flex-1 resize-none focus:outline-none"
              value={generatedText}
            />
          </div>
        </div>
        <div className="flex justify-center mb-1">
          <div className="flex-1" />
          <Button className="flex-1" onClick={onClick}>
            Next
          </Button>
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}

export default Source;
