import React from 'react'

const Button = ({label}) => {
  return (
    <div
    className={`flex items-center 
      justify-center bg-n-900
      w-full h-[48px] cursor-pointer 
      rounded-[16px] shadow-md`}>
        <p className='text-n-100 l1b'>
          {label}
        </p>
      </div>
  )
}

export default Button