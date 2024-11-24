import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full flex flex-col justify-start items-center gap-[32px]'>
      <Header 
      title={"Plans"}
      text={"Simple, transparent and enjoyable"}
      />
      <div className='w-fit h-fit flex gap-[32px]'>
        <CardFrame>

        </CardFrame>
        <CardFrame>

        </CardFrame>
      </div>
    </div>
  )
}

export default page