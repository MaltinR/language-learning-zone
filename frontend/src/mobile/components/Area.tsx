import type { ReactNode } from "react";

function Area({children, className} : {children: ReactNode; className?: string;}) {
    return (<div className={"flex justify-center items-center border-2 border-stone-700 rounded-md m-2 " + className}>{children}</div>);
}

export default Area;