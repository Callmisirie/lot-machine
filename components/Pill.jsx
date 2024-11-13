"use client"

import Image from 'next/image';
import React from 'react';

const Pill = ({
  partialTP, rightIconImgSrc, 
  blackPill, active, 
  action, email, 
  userCustomTemplateId, serverUpdate, 
  setServerUpdate, setTemplateState,
  content, copy
}) => {
  return (
    <div className={`flex items-center 
    justify-center w-fit cursor-pointer ${userCustomTemplateId && "shadow-lg"}
    h-fit gap-[2px] px-2 py-1 rounded-[16px] 
     ${blackPill ? "bg-n-900 text-white" 
     : active ? "text-n-700 border-n-700 border" 
     : "text-n-300 border-n-300 border"}`}>
      <p className='p3b text-nowrap'>{content}</p>
      {rightIconImgSrc ? 
        <div className='w-[24px] h-[24px]'
        onClick={async() => {
          if (action) {
            const res = await action(email, userCustomTemplateId)
            if (res.success) {
              setServerUpdate(!serverUpdate);
              setTemplateState("D");
            } 
          }
          if (copy) {
            navigator.clipboard.writeText(partialTP)
          }
        }}>
          <Image
            src={rightIconImgSrc}
            width={24}
            height={24}
            alt='left icon'
            priority
          />
        </div>
      :null}
    </div>
  )
}

export default Pill