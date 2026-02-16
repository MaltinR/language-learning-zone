import { useCallback, useMemo } from "react";
import type IdText from "../../interfaces/IdText";

function SettingItem({
  title,
  items,
  current,
  setter,
}: {
  title: string;
  items: Array<IdText>;
  current: string | null;
  setter: (id: string) => void;
}) {
  const getDefault = useCallback(() => {
    if (items.length > 0) return items[0].id;
    return "";
  }, [items]);

  const value: string = useMemo(() => {
    return current ?? getDefault();
  }, [current, getDefault]);

  return (
    <div className="w-full border-2 border-stone-700 rounded-md m-1 flex px-4 py-2 items-center">
      <div className="flex-1 font-bold">{title}</div>
      <select
        className="min-w-30 px-4 py-2 text-end"
        value={value}
        onChange={(e) => setter(e.target.value)}
      >
        {items.map(item => (<option key={item.id} value={item.id}>{item.text}</option>))}
      </select>
    </div>
  );
}

export default SettingItem;
