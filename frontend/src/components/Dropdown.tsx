import type IdText from "../interfaces/IdText";

function Dropdown({
  options,
  onSelect,
  className,
}: {
  options: Array<IdText>;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  return (
    <select className={className} onChange={(e) => onSelect?.(e.target.value)}>
      {options.map((el) => (
        <option value={el.id} key={el.id}>
          {el.text}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;
