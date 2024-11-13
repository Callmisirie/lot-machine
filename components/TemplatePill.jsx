"use client"

import Image from 'next/image'
import React, { useState } from 'react'

const TemplatePill = ({leftIconImgSrc, templateState, setTemplateState, userCustomTemplate}) => {
  const [openTemplate, setOpenTemplate] = useState(false)

  const handleTempleteChange = (templateValue) => {
    setTemplateState(templateValue);
    setOpenTemplate(!openTemplate)
  }

  return (
    <div className={`flex h-fit w-fit ${userCustomTemplate ? "cursor-pointer" : "cursor-default"}
    ${templateState === "D" ? "bg-n-900" 
      : "bg-white"}
    ${!openTemplate ? "border border-n-900" 
      : ""}
    rounded-[16px] items-center z-10`}
    onClick={() => {
      if (userCustomTemplate) {
        setOpenTemplate(!openTemplate)         
      }
    }}>
        {!openTemplate ? 
          <div className={`flex items-center 
          ${templateState === "D" ? "text-n-100" 
          : "text-n-900"}
          justify-center w-[27px] h-[27px]`}>
            <p className='p2b'>
              {templateState}
            </p>
          </div>
        : <div className={`flex flex-col 
          items-center justify-center 
          w-fit h-fit gap-2 
          rounded-[16px] bg-n-100 shadow-lg 
          ${templateState === "C" && "flex-col-reverse"}`}>
            <div className='flex items-center justify-center w-[98px] h-[32px] bg-n-900 rounded-[16px] cursor-pointer'
              onClick={() => handleTempleteChange("D")}
            >
              <p className='p3b text-n-100'
              >Default</p>
            </div>
            <div className='flex items-center justify-center w-[98px] h-[32px] bg-white rounded-[16px] cursor-pointer'
              onClick={() => handleTempleteChange("C")}
            >
              <p className='p3b text-n-900'
              >Custom</p>
            </div>
          </div>
        }
        {leftIconImgSrc && !openTemplate && userCustomTemplate ? 
          <div className='w-[27px] h-[27px]'>
            <Image
              src={leftIconImgSrc}
              width={27}
              height={27}
              alt='left icon'
              priority
            />
          </div>
        : null}
    </div>
  )
}

export default TemplatePill