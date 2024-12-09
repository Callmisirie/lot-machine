"use client"

import React from 'react'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import { cancelBlack } from '@/public/icons/black'

const ComfirmationPopoverButton = ({
  setComfirmationPopoverOpen,
  deleteBeneficiary, beneficiaryId, email,
}) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {    
    if (beneficiaryId) {
      const beneficiaryDetails = JSON.stringify({
        email,
        beneficiaryId
      });
      const {success} = await deleteBeneficiary(beneficiaryDetails);
             
      if (success) {
        await queryClient.invalidateQueries("beneficiary");
        setComfirmationPopoverOpen(false);
      }
    }
  } 

  return (
    <div className='absolute w-full h-full flex justify-center items-center backdrop-blur-lg z-50'>
      <div className='w-fit h-[159px] 
      flex flex-col items-end 
      px-4 pt-4 pb-2 gap-2 
      bg-white shadow-lg rounded-[16px] 
      border border-n-100'
      >
        <div className='w-[24px] h-[24px] cursor-pointer'
        onClick={() => setComfirmationPopoverOpen(false)}>
          <Image
            src={cancelBlack}
            width={24}
            height={24}
            alt='cancel icon'
            priority
          />
        </div>
        <div className='flex flex-col items-center w-fit'>
          <p className='l2r text-n-500'>
            Are you sure you want to delete this?
          </p>
          <div className="flex px-2 
          py-4 gap-4 w-full 
          justify-center items-center 
          relative">
            <div
            className={`flex items-center 
            justify-center bg-white w-[124px] 
            h-[48px] cursor-pointer
            rounded-[16px] shadow-md`}
            onClick={() => setComfirmationPopoverOpen(false)}>
              <p className='text-n-900 l3b'>
                No, cancel
              </p>
            </div>
            <div
            className={`flex items-center 
            justify-center bg-n-900
            w-[182px] h-[48px] cursor-pointer 
            rounded-[16px] shadow-md`}
            onClick={() => handleDelete()}>
              <p className='text-n-100 l3b'>
                Yes, i'm sure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComfirmationPopoverButton