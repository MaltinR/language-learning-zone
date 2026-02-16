import { useCallback, useState } from "react";
import Button from "../../components/Button";
import Area from "./Area";
import BottomBar from "./BottomBar";
import Source from "./Source";
import Translator from "./Translator";
import type NextRequest from "../../interfaces/source/NextRequest";
import type NextResponse from "../../interfaces/source/NextResponse";
import axios from "axios";

function MainPage({
  currentFromLang,
  currentToLang,
  currentSourceProviderId,
  generatedText,
  setGeneratedText,
}: {
  currentFromLang: string | null;
  currentToLang: string | null;
  currentSourceProviderId: string;
  generatedText: string;
  setGeneratedText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isNextFetching, setIsNextFetching] = useState<boolean>(false);
  const [isTranslateFetching, setIsTranslateFetching] =
    useState<boolean>(false);

  const onNextClick = useCallback(async () => {
    if (isNextFetching) return;
    try {
      setIsNextFetching(true);

      const body: NextRequest = {
        lang: currentFromLang ?? "en",
      };
      const res = await axios.post(
        `/api/sourceProviders/${currentSourceProviderId}/next`,
        body,
      );
      const data: NextResponse = res.data;
      setGeneratedText(data.result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsNextFetching(false);
    }
  }, [setGeneratedText, currentFromLang, currentSourceProviderId, isNextFetching]);

  const onTranslateClick = useCallback(() => {}, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 flex flex-col">
        <Area className="h-2/5">
          <Source text={generatedText} isFetching={isNextFetching} setText={setGeneratedText} />
        </Area>
        <Area className="h-3/5 mt-0">
          <Translator />
        </Area>
      </div>
      <BottomBar className="mx-1 mb-2">
        <div className="flex-1 flex justify-center items-center h-full">
          <Button className="flex-1 mx-1 h-full" onClick={onNextClick}>
            Next
          </Button>
          <Button className="flex-1 mx-1 h-full" onClick={onTranslateClick}>
            Translate
          </Button>
        </div>
      </BottomBar>
    </div>
  );
}

export default MainPage;
