import { useCallback, useEffect, useMemo, useState } from "react";
import Area from "./components/Area";
import Explainer from "./components/Explainer";
import Source from "./components/Source";
import Translator from "./components/Translator";
// import { commonLangs } from "./langCodes/commonLangs";
import TopBar from "./components/TopBar";
import type Lang from "./interfaces/Lang";
import axios from "axios";
import useIsMobile from "./hooks/useIsMobile";
import Mobile from "./mobile/Mobile";

async function initFetch(
  setCommonLangs: React.Dispatch<React.SetStateAction<Lang[]>>,
  setIsInited: React.Dispatch<React.SetStateAction<boolean>>,
) {
  try {
    const res = await axios.get("/api/langs");
    const data: Array<Lang> = res.data;
    setCommonLangs(data.sort((a, b) => a.name.localeCompare(b.name)));
    setIsInited(true);
  } catch (err: any) {
    console.error(err);
  }
}

function App() {
  const [text, setText] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [fromLang, setFromLang] = useState<string | null>(null);
  const [toLang, setToLang] = useState<string | null>(null);
  const [commonLangs, setCommonLangs] = useState<Array<Lang>>([]);
  const [isInited, setIsInited] = useState<boolean>(false);

  const currentText = useMemo(() => {
    return selectedText != null && selectedText != "" ? selectedText : text;
  }, [text, selectedText]);

  const isMobile = useIsMobile();

  const onTextUpdated = useCallback(
    (text: string) => {
      setText(text);
    },
    [setText],
  );

  const onMouseUp = useCallback(() => {
    const selection = window?.getSelection()?.toString();
    if (selection != null && selection.length > 0) {
      setSelectedText(selection);
    } else {
      setSelectedText(null);
    }
  }, [setSelectedText]);

  const onFromLangSelect = useCallback(
    (id: string) => {
      setFromLang(id);
    },
    [setFromLang],
  );

  const onToLangSelect = useCallback(
    (id: string) => {
      setToLang(id);
    },
    [setToLang],
  );

  useEffect(() => {
    initFetch(setCommonLangs, setIsInited);
  }, []);

  return (
    <>
      {isMobile ? (
        !isInited ? (
          <LoadingScreen />
        ) : (
          <Mobile fromLangs={commonLangs} toLangs={commonLangs} />
        )
      ) : (
        <div
          onMouseUp={onMouseUp}
          className="flex bg-stone-900 w-screen h-screen"
        >
          {!isInited ? (
            <LoadingScreen />
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <TopBar
                selectedText={selectedText}
                fromLangs={commonLangs}
                toLangs={commonLangs}
                onFromLangSelect={onFromLangSelect}
                onToLangSelect={onToLangSelect}
              />
              <div className="flex-1 flex min-h-0">
                {/* <div className="flex-1 flex items-center justify-center flex-col min-h-0"> */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="min-h-2/5 w-full">
                    <Area>
                      <Source
                        onTextUpdated={onTextUpdated}
                        updatedLang={fromLang}
                      />
                    </Area>
                  </div>
                  {/* <div className="flex w-full"> */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <Area>
                      <Translator
                        text={currentText}
                        updatedFromLang={fromLang}
                        updatedToLang={toLang}
                      />
                    </Area>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <Area>
                    <Explainer
                      text={currentText}
                      fromLangs={commonLangs}
                      toLangs={commonLangs}
                      updatedFromLang={fromLang}
                      updatedToLang={toLang}
                    />
                  </Area>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="flex text-white font-bold text-2xl flex-1 justify-center items-center">
      <div className="flex-1 text-center">Loading into App</div>
    </div>
  );
}

export default App;
