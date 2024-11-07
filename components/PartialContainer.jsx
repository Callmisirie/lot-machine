"use client";

import deleteInstrument from '@/actions/deleteInstrument';
import deletePartial from '@/actions/deletePartial';
import Image from 'next/image';
import React from 'react';

const PartialContainer = ({
  leftIconImgSrc, rightIconImgSrc,
  active, name, nickname, partials,
  dateNTime, leftIconContainer, instrumentId,
  partialId, email, machineSideDelete, partialSideDelete
}) => {
  
  const handleDelete = async () => {   
    if (machineSideDelete) {
      await deleteInstrument(email, instrumentId)      
    }
    if (partialSideDelete) {
      await deletePartial(email, partialId)      
    }
  } 

  return (
    <div className={`w-fit h-fit rounded-[16px] relative shadow-lg ${leftIconContainer && "cursor-pointer"}`}>
      <div className='w-full h-full flex justify-between px-[16px] py-[8px] gap-4'>
        {leftIconContainer ? (
          <div className='flex flex-col items-center mt-[8px]'>
            <div className='flex flex-col gap-2 justify-between mt-[8px]'>
              <div className='flex justify-center items-center w-[24px] h-[24px]'>
                {active && (
                  <div className='w-[12px] h-[12px] bg-n-700 rounded-full' />
                )}
              </div>
              <div className='w-[24px] h-[24px]'>
                <Image
                  src={leftIconImgSrc}
                  width={24}
                  height={24}
                  alt='left icon'
                  priority
                />
              </div>
            </div>
          </div>
        ) : null}
        <div className='flex flex-col items-start gap-1 w-[124px]'>
          <div className='flex flex-col'>
            <h5 className='h5 text-n-500'>{name}</h5>
            <p className='p3r text-n-500'>{nickname}</p>
          </div>
          {partials && <p className='p3b text-n-900'>{partials}</p>}
          {dateNTime && <p className='p3r text-n-300'>{dateNTime}</p>}
        </div>
        <div className='w-[24px] h-[24px] mt-[8px]'
          onClick={handleDelete}
        >
          <Image
            src={rightIconImgSrc}
            width={24}
            height={24}
            alt='right icon'
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default PartialContainer;
