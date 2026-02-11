import type { ReactNode } from "react";

function Area({children} : {children: ReactNode}) {
  return (
      <div className="flex flex-1 items-center justify-center h-full w-full p-1">
        <div className="text-stone-700 flex flex-1 items-center justify-center border-2 rounded-2xl h-full">
            {children}
        </div>
      </div>
  );
}

export default Area;
