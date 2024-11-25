import React from 'react'

const DualButton = () => {
  return (
    <div className="flex gap-4 
    w-full h-fit justify-center 
    items-center">
      <div
      className={`flex items-center 
      justify-center bg-white w-full 
      h-[48px] cursor-pointer
      rounded-[16px] shadow-md`}>
        <p className='text-n-900 l3b'>
          Cancel
        </p>
      </div>
      <div
      className={`flex items-center 
      justify-center bg-n-900
      w-full h-[48px] cursor-pointer 
      rounded-[16px] shadow-md`}>
        <p className='text-n-100 l3b'>
          Add bank
        </p>
      </div>
    </div>
  
  )
}

export default DualButton