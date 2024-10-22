"use client"

import { addBlack, boltBlack, listBlack } from '@/public/icons/black';
import { addWhite, boltWhite, listWhite } from '@/public/icons/white';
import Image from 'next/image';
import React, { useState } from 'react';

const ThreeSwitch = ({setMachineState}) => {
  const [switchType, setSwitchType] = useState("Machine");

  const handleSwitch = (currentSwitch) => {
    setSwitchType(currentSwitch); 
    setMachineState(currentSwitch);
  }

  return (
    <div className='flex items-center relative
    border border-n-300 gap-[4px] 
    h-[27px] rounded-[16px]'>
      <div className={`flex items-center 
      absolute bg-n-900 justify-center 
      w-[27px] h-[27px] rounded-full
      transition-all delay-100 ease-in-out 
      ${switchType === "Machine" ? "translate-x-0" 
        : switchType === "Instruments" ? "translate-x-[31px]"
        : switchType === "Add instrument" ? "translate-x-[62px]" 
        : "translate-x-0"}`}/>
      <div className="flex items-center 
      justify-center w-[27px] h-[27px] z-10"
      onClick={() => handleSwitch("Machine")}>
        <Image 
          src={switchType === "Machine" ? boltWhite : boltBlack} 
          width={24} 
          height={24} 
          alt='switch'
          className=""
          priority
          /> 
      </div>
      <div className="flex items-center 
      justify-center w-[27px] h-[27px] z-10"
      onClick={() => handleSwitch("Instruments")}>
        <Image 
          src={switchType === "Instruments" ? listWhite : listBlack} 
          width={24} 
          height={24} 
          alt='switch'
          className=""
          priority
          /> 
      </div>  
      <div className="flex items-center 
      justify-center w-[27px] h-[27px] z-10"
      onClick={() => handleSwitch("Add instrument")}>
        <Image 
          src={switchType === "Add instrument" ? addWhite : addBlack}
          width={24} 
          height={24} 
          alt='switch'
          className=""
          priority
          /> 
      </div>           
    </div>
  )
}

export default ThreeSwitch;