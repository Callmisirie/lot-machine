import React from 'react'

const DualButton = ({
  rightlabel,
  leftLabel,
  valueReset
}) => {
  return (
    <div className="flex px-2 
    py-4 gap-4 w-full 
    justify-center items-center 
    relative top-[88px]">
      <div
      className={`flex items-center 
      justify-center bg-white w-[124px] 
      h-[48px] cursor-pointer
      rounded-[16px] shadow-md`}
      onClick={() => valueReset("")}>
        <p className='text-n-900 l1b'>
          {leftLabel}
        </p>
      </div>
      <button type='sumbit'
      className={`flex items-center 
      justify-center bg-n-900
      w-[182px] h-[48px] rounded-[16px] shadow-md`}>
        <p className='text-n-100 l1b'>
          {rightlabel}
        </p>
      </button>
    </div>
  )
}

export default DualButton