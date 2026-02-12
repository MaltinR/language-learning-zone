import type IdText from "../interfaces/IdText";

function Dropdown({
  options,
  value,
  onSelect,
  className,
}: {
  options: Array<IdText>;
  value: string,
  onSelect?: (id: string) => void;
  className?: string;
}) {
  return (
    <select value={value} className={className} onChange={(e) => onSelect?.(e.target.value)}>
      {options.map((el) => (
        <option value={el.id} key={el.id}>
          {el.text}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;
