import type { ReactNode } from "react";

function Area({className, children} : {className?: string; children: ReactNode}) {
  return (
      <div className={`flex flex-1 items-center justify-center h-full w-full p-1 ${className}`}>
        <div className="text-stone-700 flex flex-1 items-center justify-center border-2 rounded-2xl h-full">
            {children}
        </div>
      </div>
  );
  
  return (
      <div className={`flex flex-1 items-center justify-center h-full w-full p-1 ${className}`}>
        <div className="text-stone-700 flex flex-1 items-center justify-center border-2 rounded-2xl h-full overflow-hidden min-h-0">
            {children}
        </div>
      </div>
  );
}

export default Area;
