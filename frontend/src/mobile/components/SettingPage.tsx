import Button from "../../components/Button";
import BottomBar from "./BottomBar";

function SettingPage({onDoneClick} : {onDoneClick: () => void}) {
    return (<div className="flex h-full w-full flex-col">
      <div className="flex-1 flex flex-col justify-center items-center">
        Setting Page
      </div>
      <BottomBar className="mx-1 mb-2">
        <div className="flex-1 flex justify-center items-center h-full">
          <Button className="flex-1 mx-1 h-full" onClick={onDoneClick}>Done</Button>
        </div>
      </BottomBar>
    </div>)
}

export default SettingPage;