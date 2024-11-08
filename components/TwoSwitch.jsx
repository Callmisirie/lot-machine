"use client"

import { chartlineBlack, templateBlack } from '@/public/icons/black';
import { chartlineWhite, templateWhite } from '@/public/icons/white';
import Image from 'next/image';
import React, { useState } from 'react';

const TwoSwitch = ({setChartState}) => {
  const [switchType, setSwitchType] = useState("Chart");

  const handleSwitch = (currentSwitch) => {
    setSwitchType(currentSwitch); 
    setChartState(currentSwitch);
  }

  return (
    <div className='flex items-center relative
    border border-n-300 gap-[4px] cursor-pointer
    h-[27px] rounded-[16px]'>
      <div className={`flex items-center 
      absolute bg-n-900 justify-center 
      w-[27px] h-[27px] rounded-full
      transition-all delay-100 ease-in-out 
      ${switchType === "Chart" ? "translate-x-0" 
        : switchType === "Template" ? "translate-x-[31px]" 
        : "translate-x-0"}`}/>
      <div className="flex items-center 
      justify-center w-[27px] h-[27px] z-10"
      onClick={() => handleSwitch("Chart")}>
        <Image 
          src={switchType === "Chart" ? chartlineWhite : chartlineBlack} 
          width={24} 
          height={24} 
          alt='switch'
          className=""
          priority
          /> 
      </div>
      <div className="flex items-center 
      justify-center w-[27px] h-[27px] z-10"
      onClick={() => handleSwitch("Template")}>
        <Image 
          src={switchType === "Template" ? templateWhite : templateBlack} 
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

export default TwoSwitch;