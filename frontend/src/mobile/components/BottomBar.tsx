import type { ReactNode } from "react";

function BottomBar({children, className}: {children: ReactNode; className?: string}) {
    return (<div className={"h-12 flex justify-center items-center " + className}>{children}</div>);
}

export default BottomBar