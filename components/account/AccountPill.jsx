"use client"

import { splitValue } from '@/common/splitValue';
import { cancelBlack, deleteIconBlack } from '@/public/icons/black';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React from 'react'

const AccountPill = ({
  bankName, 
  accountNumber, 
  beneficiaryId,
  setComfirmationPopoverOpen
}) => {
  const queryClient = useQueryClient();
  return (
    <div className={`flex items-center 
    justify-center min-w-[126px] h-fit
    gap-1 py-1 px-2 border border-n-700
    rounded-[16px] shadow-md`}>
      <div className='flex flex-col w-fit h-fit justify-center'>
        <p className='l2r text-n-500'>{splitValue(bankName)}</p>
        <p className='l1r text-n-700'>{accountNumber}</p>
      </div>
        <div className='w-[24px] h-[24px] cursor-pointer'
        onClick={async() => { 
          if (beneficiaryId) {
            setComfirmationPopoverOpen(true);
          }
        }}>
          <Image
            src={deleteIconBlack}
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