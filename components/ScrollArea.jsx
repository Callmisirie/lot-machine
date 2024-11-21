import React, { useRef, useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ScrollAreaFrame({
  children,
  horizontal,
  vertical,
  cardFrame,
  partialFrame,
  mainClass,
  innerClass,
  setSubIsWrapped,
  dynamicHeight
}) {
  const [isWrapped, setIsWrapped] = useState(false); // Tracks wrapping state
  const [wrapPoint, setWrapPoint] = useState(null); // Stores the precise screen width when wrapping occurs
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      if (wrapPoint && window.innerWidth > wrapPoint) {
        setIsWrapped(false);
        setWrapPoint(null); // Reset the wrap point
        setSubIsWrapped?.(false);
      }
    };

    const observer = new ResizeObserver(() => {
      const childrenArray = Array.from(container.children);

      if (childrenArray.length > 1) {
        const firstChildTop = childrenArray[0].offsetTop;

        const hasWrapping = childrenArray.some(
          (child) => child.offsetTop > firstChildTop
        );

        if (hasWrapping) {
          setIsWrapped(true);
          setSubIsWrapped?.(true);
          if (!wrapPoint) {
            setWrapPoint(window.innerWidth); // Store the screen width when wrapping occurs
          }
        } else if (!hasWrapping && wrapPoint && window.innerWidth > wrapPoint) {
          setIsWrapped(false);
          setSubIsWrapped?.(false);
        }
      } else {
        setIsWrapped(false);
        setSubIsWrapped?.(false);
      }
    });

    observer.observe(container);

    // Listen to window resize
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect(); // Cleanup observer
      window.removeEventListener("resize", handleResize);
    };
  }, [wrapPoint, setSubIsWrapped]);

  return (
    <ScrollArea
      className={` 
        ${mainClass}
        ${cardFrame && vertical && "h-[328px] w-fit"} 
        ${partialFrame && horizontal && "w-[261px] h-full max-md:w-[211px]"}
      `}
    >
      <div
        ref={containerRef}
        className={` 
          ${innerClass}
          ${cardFrame && vertical && "gap-2 flex flex-col"} 
          ${partialFrame && horizontal && "gap-2 mt-3.5 flex h-fit"}
          ${innerClass && isWrapped ? "flex-col justify-center items-center pb-8" : ""}
        `}
      >
        {mainClass
          ? React.Children.map(children, (child, index) => {
              // Place the second child first when wrapped
              if (isWrapped) {
                if (index === 1) return children[0];
                if (index === 0) return children[1];
              }
              return child;
            })
          : children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
