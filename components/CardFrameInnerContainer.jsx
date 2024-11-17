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
import Image from "next/image";
import { cautionAccentRed, cautionAccentGreen } from "@/public/icons/accent";

const CardFrameInnerContainer = ({
  machineState, serverUpdate, 
  setServerUpdate, selectInstrument, 
  setSelectInstrument, setSelectedInstrumentId,
  setComfirmationPopoverState, setComfirmationPopoverOpen,
  partialTPs, setPartialTPs,
  message, setMessage
}) => {
  const [instruments, setInstruments] = useState([]);
  const {isAuthenticated, isLoading, user} = useKindeBrowserClient();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchInstruments = async () => {
        const res = await fetch(`http://localhost:3000/api/getInstruments?email=${user?.email}`, { cache: "no-store" });
        
        if (!res.ok) return;
        
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
        setMessage={setMessage}
        message={message}
      >
        <div className="pb-4 flex flex-col justify-center items-center gap-1 w-full absolute bottom-0">
          {message?.messageContent && 
            <div className='flex gap-1 w-fit h-[24px] items-center justify-center'>
              <Image 
                src={message?.success ? cautionAccentGreen : cautionAccentRed} 
                width={24} 
                height={24} 
                alt="cation icon" 
                className="" 
                priority
                />   
              <p className={`l3r ${message?.success 
                ? "text-accent-green-300" 
                : "text-accent-red-300"}`}>
                  {message?.messageContent}
              </p>
            </div>
          }
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
      cardFrame
      vertical
      >
        {instruments?.map((instrument, idx) => (
          <div key={idx}
            onClick={() => {
              setSelectedInstrumentId(instrument._id)
              setComfirmationPopoverState("Instruments");
               
            }}
            className="no-select"
          >        
            <PartialContainer
              name={instrument.instrument}
              nickname={instrument?.nickname}
              rightIconImgSrc={cancelBlack}
              setComfirmationPopoverOpen={setComfirmationPopoverOpen}
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
          setComfirmationPopoverState={setComfirmationPopoverState}
          setComfirmationPopoverOpen={setComfirmationPopoverOpen}
          partialTPs={partialTPs}
          setPartialTPs={setPartialTPs}
          setMessage={setMessage}
        >
        <div className="pb-4 flex flex-col justify-center items-center gap-1 w-full absolute bottom-0">
          {message?.messageContent && 
            <div className='flex gap-1 w-fit h-[24px] items-center justify-center'>
              <Image 
                src={message?.success ? cautionAccentGreen : cautionAccentRed} 
                width={24} 
                height={24} 
                alt="cation icon" 
                className="" 
                priority
                />   
              <p className={`l3r ${message?.success 
                ? "text-accent-green-300" 
                : "text-accent-red-300"}`}>
                  {message?.messageContent}
              </p>
            </div>
          }
            <Button 
              blackButton
              label={machineState === "Machine" ? "Calculate"
                : machineState === "Add instrument" ? "Add"
                : null}
              message={message}
            />              
          </div>
        </FormFrame>
      </div>
    )
  }
}

export default CardFrameInnerContainer