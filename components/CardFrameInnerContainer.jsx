"use client";

import { useEffect, useState } from "react";
import PartialContainer from './PartialContainer';
import FormFrame from './FormFrame';
import Button from './Button';
import { cancelBlack } from '@/public/icons/black';
import { notFound } from "next/navigation";
import { ComboboxInput } from "./Combobox";
import { createWhite } from "@/public/icons/white";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ScrollAreaFrame } from "./ScrollArea";

const CardFrameInnerContainer = ({
  machineState, serverUpdate, 
  setServerUpdate, selectInstrument, 
  setSelectInstrument
}) => {
  const [instruments, setInstruments] = useState([]);
  const {isAuthenticated, isLoading, user} = useKindeBrowserClient();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchInstruments = async () => {
        const res = await fetch(`http://localhost:3000/api/getInstruments?email=${user?.email}`, { cache: "no-store" });
        
        if (!res.ok) return notFound();
        
        const data = await res.json();

        // console.log(data);  
        
        setInstruments(data);
      };
      fetchInstruments();
    }
  }, [isLoading, isAuthenticated, serverUpdate]);   

  if (machineState === "Add instrument") {
    return (
      <FormFrame 
        machineState={machineState}
        serverUpdate={serverUpdate}
        setServerUpdate={setServerUpdate}
      >
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
      <ScrollAreaFrame
      vertical>
        {instruments?.map((instrument, idx) => (
          <div className="no-select">
            <PartialContainer
              key={idx}
              name={instrument.instrument}
              nickname={instrument?.nickname}
              rightIconImgSrc={cancelBlack}
              instrumentId={instrument._id}
              email={user?.email}
              machineSideDelete
              serverUpdate={serverUpdate}
              setServerUpdate={setServerUpdate}
            />             
          </div>
        ))}            
      </ScrollAreaFrame>
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
          serverUpdate={serverUpdate}
          setServerUpdate={setServerUpdate}
          setSelectInstrument={setSelectInstrument}
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