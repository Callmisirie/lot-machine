"use client"

import Image from 'next/image';
import React from 'react';
import { TooltipFrame } from './TooltipFrame';

const Pill = ({
  partialTP, rightIconImgSrc, 
  blackPill, active, 
  action, noCursor,
  userCustomTemplateId,
  content, copy, 
  setComfirmationPopoverOpen,
  setComfirmationPopoverState, 
  setUserCustomTemplateId, 
  userInfo
}) => {
  return (
    <div className={`flex items-center 
    justify-center w-fit 
    ${!noCursor ? "cursor-pointer" : "select-none"} 
    ${userCustomTemplateId && "shadow-lg"}
    h-fit gap-[2px] px-2 py-1 rounded-[16px] 
      ${blackPill ? "bg-n-900 text-white" 
      : active ? "text-n-700 border-n-700 border" 
      : "text-n-300 border-n-300 border"}`}>
      <p className='p3b text-nowrap'>{content}</p>
      {rightIconImgSrc ? 
        <div className='h-[24px]'
        onClick={() => {
          if (action) {
            setComfirmationPopoverState("Custom template");
            setUserCustomTemplateId(userCustomTemplateId);
            setComfirmationPopoverOpen(true);
          }
          if (copy) {
            navigator.clipboard.writeText(partialTP)
          }
        }}>
        {copy ? (
          userInfo && userInfo?.plan !== "Free" && (
            <TooltipFrame label={"Copy"}>
              <Image
                src={rightIconImgSrc}
                width={24}
                height={24}
                alt='left icon'
                priority
              />
            </TooltipFrame>
          )
          ) : (
          <Image
            src={rightIconImgSrc}
            width={24}
            height={24}
            alt='left icon'
            priority
          />
        )}
        </div>
      :null}
    </div>
  )
}

export default Pill