"use client";

import { useState, useEffect } from "react";
import Input from "./Input";
import { addBlack, resetBlack } from "@/public/icons/black";
import Image from "next/image";
import addInstrument from "@/actions/addInstrument";
import createPartial from "@/actions/createPartial";
import { cautionAccent } from "@/public/icons/accent";
import createCustomTemplate from "@/actions/createCustomTemple";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const FormFrame = ({
  children, machineState, 
  chartState, selectInstrument, 
  customTemplate, setCustomTemplate,
  serverUpdate, setServerUpdate,
  setSelectInstrument
}) => {
  const [lotSize, setLotSize] = useState("");
  const [partialTPs, setPartialTPs] = useState([""]);
  const [finalTP, setFinalTP] = useState("");
  const [instrument, setInstrument] = useState("");
  const [nickname, setNickname] = useState("");
  const {user} = useKindeBrowserClient();

  const handleServerAction = async () => {
    if (machineState === "Machine") {
      if (
        !selectInstrument||
        !lotSize ||
        partialTPs.some((partial) => partial.trim() === "") ||
        !finalTP
      ) {
        return;
      }     
      
      const res = await createPartial(
        user?.email, selectInstrument, 
        Number(lotSize), Number(finalTP),
        partialTPs.map(Number),
      )
      if (res.success) {
        setSelectInstrument("");
        setLotSize("");
        setFinalTP("");
        setPartialTPs([""]);
      }
      setServerUpdate(!serverUpdate);
    }
    
    if (machineState === "Add instrument") {
      if (!instrument) {
        return;
      }   
      const res = await addInstrument(user?.email, instrument, nickname);
      if (res.success) {
        setInstrument("");
        setNickname("");
      }
      setServerUpdate(!serverUpdate);
    }

    if (chartState === "Template") {
      if (!customTemplate || customTemplate <= 0 || customTemplate >= 100 ) {
        return
      }
      const res = await createCustomTemplate(user?.email, Number(customTemplate));
      if (res) {
        setCustomTemplate("");
      }
      setServerUpdate(!serverUpdate);
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
        className="flex flex-col gap-2 w-full items-center">
        <div className="flex gap-2">
          <Input
            handleChange={setLotSize}
            value={lotSize}
            name="lotSize"
            label="Lot size"
            small
          />
          <Input
            handleChange={setFinalTP}
            value={finalTP}
            name="finalTP"
            label="Final TP"
            small
          />
        </div>
        <div className="w-fit">
          <label className="l2r text-n-500 w-full flex justify-between">
            Partial TPs
            <span className="l3r text-n-700 flex items-center"
              onClick={() => setPartialTPs([""])}>
              <Image 
                src={resetBlack} 
                width={24} 
                height={24} 
                alt="reset icon" 
                className="" 
                priority
                />
                reset
            </span>
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
        className="flex flex-col gap-2 w-full items-center">
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

  if (chartState === "Template") {
    return (
      <form action={handleServerAction}
        className="flex flex-col gap-2 pt-[44px] w-full">
        <Input
          handleChange={setCustomTemplate}
          value={customTemplate}
          name="customTemplate"
          label="Offload"
          description={"eg.30%"}
          descriptionImg={cautionAccent}
        />
        {children}
      </form> 
    )
  }
};

export default FormFrame;