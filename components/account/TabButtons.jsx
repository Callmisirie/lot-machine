import React from 'react'

const TabButtons = ({
  rightlabel,
  leftLabel,
}) => {
  return (
    <div className="flex px-2 
    py-4 gap-4 w-full 
    justify-center items-center">
      <div
      className={`flex items-center 
      justify-center bg-white w-full 
      h-[48px] cursor-pointer
      rounded-[16px] shadow-md`}>
        <p className='text-n-900 l1b'>
          {leftLabel}
        </p>
      </div>
      <div
      className={`flex items-center 
      justify-center bg-n-900
      w-full h-[48px] rounded-[16px] shadow-md`}>
        <p className='text-n-100 l1b'>
          {rightlabel}
        </p>
      </div>
    </div>
  )
}

export default TabButtons