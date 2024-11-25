import { cancelBlack } from '@/public/icons/black';
import Image from 'next/image';
import React from 'react'

const AccountPill = ({bankName, accountNumber}) => {
  return (
    <div className={`flex items-center 
    justify-center min-w-[126px] h-fit
    gap-1 py-1 px-2 border border-n-700
    rounded-[16px] shadow-md`}>
      <div className='flex flex-col w-fit h-fit'>
        <p className='l2r text-n-500'>{bankName}</p>
        <p className='l1r text-n-700'>{accountNumber}</p>
      </div>
        <div className='w-[24px] h-[24px]'>
          <Image
            src={cancelBlack}
            width={24}
            height={24}
            alt='delete icon'
            priority
          />
        </div>
    </div>
  )
}

export default AccountPill