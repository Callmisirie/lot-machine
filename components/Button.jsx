"use client"

import Image from 'next/image'
import React from 'react'

const Button = ({
  rightIcon, 
  leftIcon, 
  rightIconImgSrc, 
  leftIconImgSrc, 
  label, 
  whiteButton,
  blackButton,
}) => {
  return (   
    <button type='sumbit'
    className={`${whiteButton ? "bg-white" 
      : blackButton ? "bg-n-900" 
      : "bg-white"} w-full h-[48px]
    rounded-[32px] shadow-md`}>
      <div className='gap-2 flex justify-center 
      items-center'>
        {leftIcon && (
          <Image 
            src={leftIconImgSrc} 
            width={24} 
            height={24} 
            alt="left icon" 
            className="" 
            priority
            />          
        )}
        <p className={`${ whiteButton ? "text-n-900" 
          : blackButton ? "text-n-100" 
          : "text-900"} l1b `}>
          {label}
        </p>
        {rightIcon && (
          <Image 
            src={rightIconImgSrc} 
            width={24} 
            height={24} 
            alt="right icon" 
            className="" 
            priority
            />            
        )}
      </div>
    </button>
  )
}

export default Button;