import { useCallback, useState } from "react";
import Area from "./components/Area";
import Explainer from "./components/Explainer";
import Source from "./components/Source";
import Translator from "./components/Translator";

function App() {
  const [text, setText] = useState("");

  const onTextUpdated = useCallback((text: string) => {
    setText(text);
  }, [setText]);

  return (
    <div className="flex bg-stone-900 w-screen h-screen">
      <div className="flex-1 flex items-center justify-center flex-col">
        <div className="h-2/5 w-full">
          <Area>
            <Source onTextUpdated={onTextUpdated}/>
          </Area>
        </div>
        <div className="h-3/5 w-full">
          <Area>
            <Translator text={text}/>
          </Area>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Area>
          <Explainer />
        </Area>
      </div>
    </div>
  );
}

export default App;
