"use client";

import { useState, useEffect } from "react";
import Input from "./Input";
import { addBlack } from "@/public/icons/black";
import Image from "next/image";
import addInstrument from "@/actions/addInstrument";
import { useSession } from "next-auth/react";

const FormFrame = ({children, machineState, selectInstrument}) => {
  const [lotSize, setLotSize] = useState("");
  const [partialTPs, setPartialTPs] = useState([""]);
  const [finalTP, setFinalTP] = useState("");
  const [instrument, setInstrument] = useState("");
  const [nickname, setNickname] = useState("");
  const { data: session } = useSession();

  // function handleAddGoal() {
  //   if (
  //     !lotSize ||
  //     partialTPs.some((partial) => partial.trim() === "") ||
  //     !finalTP
  //   ) {
  //     return;
  //   }

  //   const targets = partialTP(
  //     partialTPs.map(Number),
  //     Number(finalTP),
  //     Number(lotSize)
  //   );

  //   const newGoal = { instrument: , targets };
  //   const updatedGoals = [...goals, newGoal];
  //   setGoals(updatedGoals);
  //   localStorage.setItem("goals", JSON.stringify(updatedGoals));
  //   setLotSize("");
  //   setPartialTPs([""]);
  //   setFinalTP("");
  // }

  const handleServerAction = () => {
    if (machineState === "Machine") {
      if (
        !selectInstrument||
        !lotSize ||
        partialTPs.some((partial) => partial.trim() === "") ||
        !finalTP
      ) {
        return;
      }     
      console.log({
        selectInstrument,
        lotSize,
        partialTPs, 
        finalTP,
      });
    }
    
    if (machineState === "Add instrument") {
      addInstrument(session?.user?.email, instrument, nickname);
    }
  } 

  function handleAddPartialTP() {
    let latestPartialTPs = partialTPs.length;
    latestPartialTPs = partialTPs[latestPartialTPs - 1].length;

    if (latestPartialTPs > 0) {
      setPartialTPs((prevValue) => [...prevValue, ""]);
    }
  }

  function handlePartialTPChange(value, index) {
    const updatedPartialTPs = [...partialTPs];
    updatedPartialTPs[index] = value;
    setPartialTPs(updatedPartialTPs);
  }

  if (machineState === "Machine") {
    return (
      <form action={handleServerAction}
        className="flex flex-col gap-2 w-full">
        <div className="flex gap-2">
          <Input
            handleChange={setFinalTP}
            value={finalTP}
            name="finalTP"
            label="Final TP"
            small
          />
          <Input
            handleChange={setLotSize}
            value={lotSize}
            name="lotSize"
            label="Lot size"
            small
          />
        </div>
        <div className="w-fit">
          <label className="l2r text-n-500 w-full">
            Partial TPs
          </label>
          <div className="w-fit grid grid-cols-2 gap-x-2 gap-y-1">
            {partialTPs.map((partial, idx) => (
              <Input
                handleChange={(value) => handlePartialTPChange(value, idx)}
                key={idx}
                value={partial}
                name={`goalPartialTP-${idx}`}
                small
              />
            ))}
            {partialTPs.length < 4 ? (
              <div
                className={`${
                  partialTPs.length < 4
                    ? "cursor-pointer"
                    : " cursor-not-allowed"
                } w-full h-[32px] flex justify-center items-center`}
                disabled={partialTPs.length >= 4}
                onClick={handleAddPartialTP}
              >
                <Image 
                  src={addBlack} 
                  width={40} 
                  height={40} 
                  alt="add icon" 
                  className="" 
                  priority
                  />                 
              </div>
            ) : null}
          </div>
        </div>
        {children}
      </form>     
    );
  }

  if (machineState === "Add instrument") {
    return (
      <form action={handleServerAction}
        className="flex flex-col gap-2 w-full">
        <Input
          handleChange={setInstrument}
          value={instrument}
          name="instrument"
          label="Instrument"
          type={"text"}
        />
        <Input
          handleChange={setNickname}
          value={nickname}
          name="nickname"
          label="Nickname"
          type={"text"}
          optional
        />
        {children}
      </form>     
    );
  }
};

export default FormFrame;