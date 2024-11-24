import React, { useRef, useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useResizeObserver from "use-resize-observer";

export function ScrollAreaFrame({
  children,
  horizontal,
  vertical,
  cardFrame,
  partialFrame,
  mainClass,
  innerClass,
  setSubIsWrapped,
}) {
  const [isWrapped, setIsWrapped] = useState(false); // Tracks wrapping state
  const [wrapPoint, setWrapPoint] = useState(null); // Stores the precise screen width when wrapping occurs
  const containerRef = useRef(null);

  // Using the useResizeObserver hook
  const { ref, width } = useResizeObserver();

  useEffect(() => {
    const handleResize = () => {
      if (wrapPoint && width > wrapPoint) {
        if (wrapPoint) {
          setIsWrapped(false);
          setWrapPoint(null); // Reset the wrap point
          setSubIsWrapped?.(false);
        }
      }
    };

    if (containerRef.current && width) {
      const childrenArray = Array.from(containerRef.current.children);

      if (childrenArray.length > 1) {
        const firstChildTop = childrenArray[0].offsetTop;

        const hasWrapping = childrenArray.some(
          (child) => child.offsetTop > firstChildTop
        );

        if (hasWrapping) {
          setIsWrapped(true);
          setSubIsWrapped?.(true);
          if (!wrapPoint) {
            setWrapPoint(width); // Store the screen width when wrapping occurs
          }
        }
        handleResize();
      } else {
        setIsWrapped(false);
        setSubIsWrapped?.(false);
      }
    }
  }, [width, wrapPoint, setSubIsWrapped]);

  return (
    <ScrollArea
      className={` 
        ${mainClass}
        ${cardFrame && vertical && "h-[328px] w-fit"} 
        ${partialFrame && horizontal && "w-[261px] h-full max-md:w-[211px]"}`}
    >
      <div
        ref={(node) => {
          containerRef.current = node;
          ref(node); // Attach the ref to the container
        }}
        className={` 
          ${innerClass}
          ${cardFrame && vertical && "gap-2 flex flex-col"} 
          ${partialFrame && horizontal && "gap-2 mt-3.5 flex h-fit"} 
          ${innerClass && isWrapped ? "flex-col justify-center items-center pb-8" : ""}`}
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