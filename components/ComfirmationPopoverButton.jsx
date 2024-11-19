"use client"

import React from 'react'
import { cancelBlack } from '@/public/icons/black'
import Image from 'next/image'
import deleteInstrument from '@/actions/deleteInstrument'
import deletePartial from '@/actions/deletePartial'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import deleteCustomTemplate from '@/actions/deleteCustomTemplete'
import { useQueryClient } from '@tanstack/react-query'

const ComfirmationPopoverButton = ({
  setComfirmationPopoverOpen, comfirmationPopoverState,
  selectedInstrumentId, setSelectedPartialId,
  selectedPartialId, 
  setServerUpdate, serverUpdate, 
  setPartialTPs, userCustomTemplateId, 
  setTemplateState, deleteSelectedPartialId,
  setSelectedPartialIndex, selectedPartialIndex,
  partials, setSelectedPartialTPIndex
}) => {
  const {user} = useKindeBrowserClient();
  const email = user?.email;
  const queryClient = useQueryClient();

  const handleDelete = async () => {    
    if (comfirmationPopoverState === "Instruments") {
      const res = await deleteInstrument(email, selectedInstrumentId);
      if (res.success) {
        await queryClient.invalidateQueries("instruments");    
        setServerUpdate(!serverUpdate);
        setComfirmationPopoverOpen(false); 
      }
    } else if (comfirmationPopoverState === "Partials") {
      const res = await deletePartial(email, deleteSelectedPartialId ? deleteSelectedPartialId : selectedPartialId);
      
      if (res.success) {
        if (selectedPartialId === deleteSelectedPartialId) {
          await setSelectedPartialIndex(() => {
            if (selectedPartialIndex === 0) {
              return 0;
            } else if (selectedPartialIndex > 0) {
              return selectedPartialIndex - 1;
            }
          })
          await setSelectedPartialId(() => {
            const selectedPartial = partials.find((partial, idx) => selectedPartialIndex === idx);
            return selectedPartial._id;
          })
          setSelectedPartialTPIndex(0);
        }
        
        await queryClient.invalidateQueries("partials");     
        setServerUpdate(!serverUpdate);
        setComfirmationPopoverOpen(false); 
      }
    } else if (comfirmationPopoverState === "PartialTPs") {
      setPartialTPs([""]);  
      setComfirmationPopoverOpen(false);   
    } else if (comfirmationPopoverState === "Custom template") {
      const res = await deleteCustomTemplate(email, userCustomTemplateId);
      if (res.success) {
        await queryClient.invalidateQueries("userCustomTemplate");  
        setServerUpdate(!serverUpdate);
        setTemplateState("D");
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
            {comfirmationPopoverState === "PartialTPs" 
            ? "Are you sure you want to reset partial TPs?" 
            : "Are you sure you want to delete this?"}
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