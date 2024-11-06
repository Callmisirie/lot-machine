"use client";

import { useEffect, useState } from "react";
import PartialContainer from './PartialContainer';
import { cancelBlack } from '@/public/icons/black';
import { useSession } from 'next-auth/react';
import { notFound } from "next/navigation";
import Pill from "./Pill";
import partialCalc from "@/common/partialCalc";

const ChartFrameInnerContainer = ({chartState, partials, selectedPartialIndex}) => {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const [instruments, setInstruments] = useState([]);
  const [selectedPartialTPs, setSelectedPartialTPs] = useState([]);

  useEffect(() => {
    console.log(partials);
    const partial = partials.find((partial, idx) => selectedPartialIndex === idx );

    if (partial) {
      const partialTPs = partialCalc(partial?.lotSize, partial?.finalTP, partial?.partialTPs);  

      setSelectedPartialTPs(partialTPs)

      console.log({
        partial,
        partialTPs
      });
    }
    
  }, [partials, selectedPartialIndex]);   

  if (chartState === "Template") {
    return (
      <div>

      </div>
    )
  }

  if (chartState === "Chart") {
    return (
      <div className="flex flex-col items-center justify-between w-full h-full">
        <div></div>
        {selectedPartialTPs.length > 0 ? 
          <div className="flex w-[261px] 
          h-fit gap-2 p-4 rounded-[16px] 
          border border-n-300 shadow-lg">
            {selectedPartialTPs?.map((partialTP, idx) => {
              return (
                <Pill 
                  key={idx}
                  partialTP={`TP${idx + 1}: ${partialTP}`}
                />              
              )
            })}
          </div>
        : null}
      </div>
    )
  }
}

export default ChartFrameInnerContainer