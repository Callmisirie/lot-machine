import React, { useState } from 'react'
import Button from './Button'
import ThreeSwitch from './ThreeSwitch'

const CardFrame = ({children, button, buttonLabel}) => {
  const [title, setTitle] = useState("Machine");

  return (
    <div className="w-[303px] h-[608px] 
    bg-white rounded-[32px] shadow-lg relative">
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 px-[32px]">
        <div className='flex justify-between items-center w-full mt-[32px]'>
          <ThreeSwitch setTitle={setTitle} /> 
        </div>
        <h4 className='h4 absolute top-[64px]'>
          {title}
        </h4>
        <div className="">
          {children}          
        </div>

        {button ? (
          <div className='absolute top-[528px]'>
            <Button 
              blackButton
              label={buttonLabel}
            />          
          </div>          
        ): null}


      </div>
    </div>
  )
}

export default CardFrame