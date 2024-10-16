import { list } from '@/public/icons'
import Image from 'next/image'
import React from 'react'
import { Switch } from './ui/switch'
import Button from './Button'

const CardFrame = () => {
  return (
    <div className="w-[303px] h-[608px] 
    bg-white rounded-[32px] shadow-xl">
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 px-[32px]">
        <div className='flex justify-between items-center w-full'>
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
        <h4 className='h4'>
          Title
        </h4>

        <Button 
          buttonColor={"bg-n-900"}
        />
      </div>
    </div>
  )
}

export default CardFrame