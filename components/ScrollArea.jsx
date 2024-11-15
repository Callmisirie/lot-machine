import * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ScrollAreaFrame({children, horizontal, vertical}) {
  return (
    <ScrollArea className={`${vertical && "h-[328px] w-fit"} ${horizontal && "w-[261px] h-full"}`}>
      <div className={`${vertical && "gap-2 flex flex-col"} ${horizontal && "gap-2 mt-3.5 flex h-fit"}`}>
        {children}
      </div>
      <ScrollBar
      orientation="horizontal"/>
    </ScrollArea>
  )
}
