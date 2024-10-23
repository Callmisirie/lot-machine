import Image from 'next/image';
import React from 'react';

const PartialContainer = ({
  leftIconImgSrc,
  rightIconImgSrc,
  active,
  name,
  nickname,
  partials,
  dateNTime,
  leftIconContainer,
}) => {
  return (
    <div className='w-fit h-fit rounded-[16px] relative shadow-lg'>
      <div className='w-full h-full flex justify-between px-[16px] py-[8px] gap-4'>
        <div className='flex flex-col items-center gap-5 mt-[8px]'>
          {leftIconContainer ? (
            <>
              {active && (
                <div className='w-[12px] h-[12px] bg-n-700 rounded-full' />
              )}
              <div className='w-[24px] h-[24px]'>
                <Image
                  src={leftIconImgSrc}
                  width={24}
                  height={24}
                  alt='left icon'
                  priority
                />
              </div>
            </>
          ) : null}
        </div>
        <div className='flex flex-col items-start gap-1 w-[124px]'>
          <div className='flex flex-col'>
            <h5 className='h5 text-n-500'>{name}</h5>
            <p className='p3r text-n-500'>{nickname}</p>
          </div>
          {partials && <p className='p3b text-n-900'>{partials}</p>}
          {dateNTime && <p className='p3r text-n-300'>{dateNTime}</p>}
        </div>
        <div className='w-[24px] h-[24px] mt-[8px]'>
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
