import { list } from '@/public/icons'
import Image from 'next/image'
import React, { Children } from 'react'
import { Switch } from './ui/switch'
import Button from './Button'

const CardFrame = ({children, button, buttonLabel, title}) => {
  return (
    <div className="w-[303px] h-[608px] 
    bg-white rounded-[32px] shadow-lg relative">
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 px-[32px]">
        <div className='flex justify-between items-center w-full mt-[32px]'>
          <Switch />
          <Image 
            src={list} 
            width={24} 
            height={24} 
            alt="icon" 
            className="" 
            priority
            />  
        </div>
        <h4 className='h4 mt-[32px]'>
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