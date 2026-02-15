import type { ReactNode } from "react";

function MainContent({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-1 justify-center items-center h-full w-full">
      {children}
    </div>
  );
}

export default MainContent;
