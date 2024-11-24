import React from 'react'

const Header = ({title, text}) => {
  return (
    <div className='w-fit h-fit flex flex-col justify-center items-center'>
      <h2 className='h2 text-n-500'>{title}</h2>
      <p className='p1b text-n-700'>{text}</p>
    </div>
  )
}

export default Header