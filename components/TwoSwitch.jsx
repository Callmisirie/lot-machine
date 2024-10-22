"use client"

import { boltBlack, listBlack } from '@/public/icons/black';
import { boltWhite, listWhite } from '@/public/icons/white';
import Image from 'next/image';
import React, { useState } from 'react';

const TwoSwitch = ({setTitle}) => {
  const [switchType, setSwitchType] = useState(1);

  const handleSwitch = (currentSwitch) => {
    setSwitchType(currentSwitch); 
    setTitle(currentSwitch);
  }

  return (
    <div className='flex items-center relative
    border border-n-300 gap-[4px] 
    h-[27px] rounded-[16px]'>
      <div className={`flex items-center 
      absolute bg-n-900 justify-center 
      w-[27px] h-[27px] rounded-full
      transition-all delay-100 ease-in-out 
      ${switchType === 1 ? "translate-x-0" 
        : switchType === 2 ? "translate-x-[31px]" 
        : "translate-x-0"}`}/>
      <div className="flex items-center 
      justify-center w-[27px] h-[27px] z-10"
      onClick={() => handleSwitch(1)}>
        <Image 
          src={switchType === 1 ? boltWhite : boltBlack} 
          width={24} 
          height={24} 
          alt='switch'
          className=""
          priority
          /> 
      </div>
      <div className="flex items-center 
      justify-center w-[27px] h-[27px] z-10"
      onClick={() => handleSwitch(2)}>
        <Image 
          src={switchType === 2 ? listWhite : listBlack} 
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