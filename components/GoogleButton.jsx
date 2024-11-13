"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

const GoogleButton = ({
  rightIcon, 
  leftIcon, 
  rightIconImgSrc, 
  leftIconImgSrc, 
  label, 
  buttonColor,
  signIn,
  register
  
}) => {
  if (signIn) {
    return (
      <LoginLink
      className={`${buttonColor ? buttonColor : "bg-white"} w-[245px] h-[56px]
      rounded-[32px] flex items-center justify-center`}>
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
          <p className='l2b text-n-900'>
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
      </LoginLink>
    )
  }

  if (register) {
    return (
      <RegisterLink
      className={`${buttonColor ? buttonColor : "bg-white"} w-[245px] h-[56px]
      rounded-[32px] flex items-center justify-center`}>
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
          <p className='l2b text-n-900'>
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
      </RegisterLink>
    )
  }
}

export default GoogleButton;