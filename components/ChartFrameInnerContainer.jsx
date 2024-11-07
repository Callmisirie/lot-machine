"use client";

import { useEffect, useState } from "react";
import Pill from "./Pill";
import partialCalc from "@/common/partialCalc";
import { curveLine } from "@/public/icons";
import Image from "next/image";
import { clipboardWhite } from "@/public/icons/white";

const ChartFrameInnerContainer = ({chartState, partials, selectedPartialIndex}) => {
  const [selectedPartialTPs, setSelectedPartialTPs] = useState([]);
  const [selectedPartialTPIndex, setSelectedPartialTPIndex] = useState(0)

  useEffect(() => {
    const partial = partials.find((partial, idx) => selectedPartialIndex === idx );

    if (partial) {
      const partialTPs = partialCalc(partial?.lotSize, partial?.finalTP, partial?.partialTPs);  

      setSelectedPartialTPs(partialTPs)
    }
  }, [partials, selectedPartialIndex]);   

  if (chartState === "Template") {
    return (
      <div>

      </div>
    )
  }

  if (chartState === "Chart") {
    const partialTP = selectedPartialTPs.find((partialTP, idx) => selectedPartialTPIndex === idx );
    return (
      <div className="flex flex-col items-center justify-between w-full h-full">
        {selectedPartialTPs.length > 0 ? 
          <div className="relative mt-[16px]">
            <div className='w-[290px] h-[160px]'>
              <Image
                src={curveLine}
                width={290}
                height={160}
                alt='curve-line icon'
                priority
              />
            </div>
            <div className="absolute top-0 right-0">
              <Pill
                partialTP={`TP${selectedPartialTPIndex + 1}: ${partialTP}`}
                leftIconImgSrc={clipboardWhite}
                blackPill
              />
            </div>
          </div>
        :null}
        {selectedPartialTPs.length > 0 ? 
          <div className="flex w-[261px] 
          h-fit gap-2 p-4 rounded-[16px] 
          border border-n-300 shadow-lg">
            {selectedPartialTPs?.map((partialTP, idx) => {
              return (
                <div key={idx}
                  onClick={() => setSelectedPartialTPIndex(idx)}
                >
                  <Pill 
                    partialTP={`TP${idx + 1}: ${partialTP}`}
                    active={selectedPartialTPIndex === idx ? true : false}
                  />              
                </div>
              )
            })}
          </div>
        : null}
      </div>
    )
  }
}

export default ChartFrameInnerContainer