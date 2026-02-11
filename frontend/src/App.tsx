import Area from "./components/Area";
import Explainer from "./components/Explainer";
import Source from "./components/Source";
import Translator from "./components/Translator";

function App() {
  return (
    <div className="flex bg-stone-900 w-screen h-screen">
      <div className="flex-1 flex items-center justify-center flex-col">
        <Area><Source/></Area>
        <Area><Translator/></Area>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Area><Explainer/></Area>
      </div>
    </div>
  );
}

export default App;
