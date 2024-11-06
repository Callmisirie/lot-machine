import React from 'react'

const Pill = ({partialTP}) => {
  return (
    <div className='flex items-center 
    justify-center w-fit cursor-pointer
    h-[23px] px-2 py-1 rounded-[16px] 
    border border-n-700 bg-white'>
      <p className='p3b text-n-700 text-nowrap'>{partialTP}</p>
    </div>
  )
}

export default Pill