import Image from 'next/image'
import React from 'react'

const Pill = ({
  partialTP, leftIconImgSrc, 
  blackPill, active, 
  action, email, 
  userCustomTemplateId, serverUpdate, 
  setServerUpdate
}) => {
  return (
    <div className={`flex items-center 
    justify-center w-fit cursor-pointer
    h-fit gap-[2px] px-2 py-1 rounded-[16px] 
     ${blackPill ? "bg-n-900 text-white" 
     : active ? "text-n-700 border-n-700 border" 
     : "text-n-300 border-n-300 border"}`}>
      <p className='p3b text-nowrap'>{partialTP}</p>
      {leftIconImgSrc ? 
        <div className='w-[24px] h-[24px]'
        onClick={async() => {
          await action(email, userCustomTemplateId) 
          setServerUpdate(!serverUpdate) 
        }}
        >
          <Image
            src={leftIconImgSrc}
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