import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full flex flex-col justify-start items-center gap-[32px]'>
      <Header 
      title={"Profile"}
      text={"Simple, transparent and enjoyable"}
      />
      <CardFrame>

      </CardFrame>
    </div>
  )
}

export default page