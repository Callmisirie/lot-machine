"use client";

import { useEffect, useState } from "react";
import PartialContainer from './PartialContainer';
import FormFrame from './FormFrame';
import Button from './Button';
import { cancelBlack } from '@/public/icons/black';
import { useSession } from 'next-auth/react';
import { notFound } from "next/navigation";
import { ComboboxInput } from "./Combobox";
import { createWhite } from "@/public/icons/white";


const CardFrameInnerContainer = ({machineState}) => {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const [instruments, setInstruments] = useState([]);
  const [selectInstrument, setSelectInstrument] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const fetchInstruments = async () => {
        const res = await fetch(`http://localhost:3000/api/getInstruments?email=${email}`, { cache: "no-store" });
        
        if (!res.ok) return notFound();
        
        const data = await res.json()

        // console.log(data);  
        
        setInstruments(data);
      };
      fetchInstruments();
    }
  }, [session, status]);   

  if (machineState === "Add instrument") {
    return (
      <FormFrame machineState={machineState}>
        <div className="pb-4 gap-1 w-full absolute bottom-0">
          <Button 
            blackButton
            rightIcon
            rightIconImgSrc={createWhite}            
            label={machineState === "Machine" ? "Calculate"
              : machineState === "Add instrument" ? "Add"
              : null}
          />              
        </div>
      </FormFrame>
    )
  }

  if (machineState === "Instruments") {
    return (
      <div className="flex flex-col gap-2">
        {instruments?.map((instrument, idx) => (
            <PartialContainer
              key={idx}
              name={instrument.instrument}
              nickname={instrument?.nickname}
              rightIconImgSrc={cancelBlack}
              instrumentId={instrument._id}
              email={email}
              machineSideDelete
            />             
        ))}              
      </div>
    )
  }

  if (machineState === "Machine") {
    return (
      <div className="flex flex-col gap-2 w-[184px]">
        <ComboboxInput 
          userInstruments={instruments}
          selectInstrument={selectInstrument}
          setSelectInstrument={setSelectInstrument}
        />
        <FormFrame 
          machineState={machineState}
          selectInstrument={selectInstrument}
        >
          <div className="pb-4 gap-1 w-full absolute bottom-0">
            <Button 
              blackButton
              label={machineState === "Machine" ? "Calculate"
                : machineState === "Add instrument" ? "Add"
                : null}
            />              
          </div>
        </FormFrame>
      </div>
    )
  }
}

export default CardFrameInnerContainer