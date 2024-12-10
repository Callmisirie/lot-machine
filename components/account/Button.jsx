import { bankWhite } from '@/public/icons/white';
import Image from 'next/image';
import React from 'react'

const Button = ({label, requestWithdrawalAction}) => {
  return (
    <div
    className={`flex items-center 
      justify-center bg-n-900
      w-full h-[48px] cursor-pointer 
      rounded-[16px] shadow-md gap-2`}
      onClick={async() => {
        if (requestWithdrawalAction) {
          await requestWithdrawalAction();
        }
      }}>
        <p className='text-n-100 l1b'>
          {label}
        </p>
        <Image
          src={bankWhite}
          width={24}
          height={24}
          alt='cancel icon'
          priority
        />
      </div>
  )
}

export default Button