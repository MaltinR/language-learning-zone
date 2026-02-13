import type IdText from "../interfaces/IdText";
import Dropdown from "./Dropdown";

function TextDropdown({
  name,
  options,
  value,
  onSelect,
  className,
}: {
  name: string;
  options: Array<IdText>;
  value: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  return (
    <>
      <div className="text-white ml-4 mr-1">{name}</div>
      <Dropdown
        className={`bg-stone-800 rounded text-white p-1 w-25 focus:outline-none ${className ?? ""}`}
        onSelect={onSelect}
        options={options}
        value={value}
      />
    </>
  );
}

export default TextDropdown;