"use client"

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

const Button = ({rightIcon, 
  leftIcon, 
  rightIconImgSrc, 
  leftIconImgSrc, 
  label, 
  buttonColor
}) => {
  return (
    <button onClick={ () => signIn("google")}
    className={`${buttonColor ? buttonColor : "bg-white"} w-[245px] h-[56px]
    rounded-[32px]`}>
      <div className='gap-2 flex justify-center 
      items-center'>
        {leftIcon && (
          <Image 
            src={leftIconImgSrc} 
            width={24} 
            height={24} 
            alt="left icon" 
            className="" />          
        )}
        <p className='l2b text-n-900'>
          {label}
        </p>
        {rightIcon && (
          <Image 
            src={rightIconImgSrc} 
            width={24} 
            height={24} 
            alt="right icon" 
            className="" />            
        )}
      </div>
    </button>
  )
}

export default Button