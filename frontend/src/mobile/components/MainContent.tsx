import type { ReactNode } from "react";

function MainContent({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-1 justify-center items-center h-full w-full min-h-0">
      {children}
    </div>
  );
}

export default MainContent;
