"use client";

import { useEffect, useState } from "react";
import PartialContainer from './PartialContainer';
import { FormFrame } from './FormFrame';
import Button from './Button';
import { cancelBlack } from '@/public/icons/black';
import getInstruments from '@/actions/getInstruments';
import { useSession } from 'next-auth/react';

const CardFrameInnerContainer = ({machineState}) => {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const [instruments, setInstruments] = useState([]);

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     const fetchInstruments = async () => {
  //       console.log("Checking log", email);        
  //       const instruments = await getInstruments(email);
  //       setInstruments(instruments);

  //     };
  //     fetchInstruments();
  //   }
  // }, [session, instruments]); 
  
  if (machineState === "Add instrument") {
    return (
      <FormFrame machineState={machineState}>
        <div className="pb-4 gap-1 w-full absolute bottom-0">
          <Button 
            blackButton
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
        {instruments?.map((instrument) => (
            <PartialContainer 
              name={instrument.instrument}
              nickname={instrument.nickname}
              rightIconImgSrc={cancelBlack}
            />             
        ))}              
      </div>
    )
  }
}

export default CardFrameInnerContainer