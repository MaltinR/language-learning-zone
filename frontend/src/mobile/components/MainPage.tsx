import { useCallback } from "react";
import Button from "../../components/Button";
import Area from "./Area";
import BottomBar from "./BottomBar";
import Source from "./Source";
import Translator from "./Translator";

function MainPage() {
    const onNextClick = useCallback(() => {

    }, []);

    const onTranslateClick = useCallback(() => {

    }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 flex flex-col">
        <Area className="h-2/5">
          <Source />
        </Area>
        <Area className="h-3/5 mt-0">
          <Translator />
        </Area>
      </div>
      <BottomBar className="mx-1 mb-2">
        <div className="flex-1 flex justify-center items-center h-full">
          <Button className="flex-1 mx-1 h-full" onClick={onNextClick}>Next</Button>
          <Button className="flex-1 mx-1 h-full" onClick={onTranslateClick}>Translate</Button>
        </div>
      </BottomBar>
    </div>
  );
}

export default MainPage;
