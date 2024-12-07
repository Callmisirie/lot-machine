"use client";

import { useEffect, useState } from "react";
import PartialContainer from './PartialContainer';
import FormFrame from './FormFrame';
import Button from './Button';
import { deleteIconBlack } from '@/public/icons/black';
import { ComboboxInput } from "./Combobox";
import { createWhite } from "@/public/icons/white";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ScrollAreaFrame } from "./ScrollArea";
import Image from "next/image";
import { cautionAccentRed, cautionAccentGreen } from "@/public/icons/accent";
import { useQuery } from "@tanstack/react-query";

const fetchInstruments = async (email) => {
  const res = await fetch(`/api/getInstruments?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch instruments");
  return res.json();
};

const CardFrameInnerContainer = ({
  machineState, serverUpdate, 
  setServerUpdate, selectInstrument, 
  setSelectInstrument, setSelectedInstrumentId,
  setComfirmationPopoverState, setComfirmationPopoverOpen,
  partialTPs, setPartialTPs,
  message, setMessage
}) => {
  const {isAuthenticated, isLoading, user} = useKindeBrowserClient();

  const {
    data: instruments,
    isLoading: instrumentsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["instruments", user?.email],
    queryFn: async () => await fetchInstruments(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });   

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
              rightIconImgSrc={deleteIconBlack}
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