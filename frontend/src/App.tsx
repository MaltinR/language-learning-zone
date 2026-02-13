import { useCallback, useMemo, useState } from "react";
import Area from "./components/Area";
import Explainer from "./components/Explainer";
import Source from "./components/Source";
import Translator from "./components/Translator";
import { commonLangs } from "./langCodes/commonLangs";
import TopBar from "./components/TopBar";

function App() {
  const [text, setText] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const currentText = useMemo(() => {
    return selectedText != null && selectedText != "" ? selectedText : text;
  }, [text, selectedText])

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

  return (
    <div onMouseUp={onMouseUp} className="flex bg-stone-900 w-screen h-screen">
      <div className="flex-1 flex flex-col min-h-0">
        <TopBar selectedText={selectedText} fromLangs={commonLangs} toLangs={commonLangs} />
        <div className="flex-1 flex min-h-0">
          {/* <div className="flex-1 flex items-center justify-center flex-col min-h-0"> */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="min-h-2/5 w-full">
              <Area>
                <Source onTextUpdated={onTextUpdated} />
              </Area>
            </div>
            {/* <div className="flex w-full"> */}
            <div className="flex-1 flex flex-col min-h-0">
              <Area>
                <Translator text={currentText} />
              </Area>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Area>
              <Explainer
                text={currentText}
                fromLangs={commonLangs}
                toLangs={commonLangs}
              />
            </Area>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
