import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ScrollAreaFrame({
  children,
  mainClass,
  innerClass,
}) {
  return (
    <ScrollArea className={`${mainClass}`}>
      <div className={`${innerClass}`}>
        {children}
      </div>
    </ScrollArea>
  );
}