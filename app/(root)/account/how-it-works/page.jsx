import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import TabButtons from '@/components/account/TabButtons'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full flex flex-col justify-start items-center gap-[32px]'>
      <Header 
      title={"How it works"}
      text={"Simple, transparent and enjoyable"}
      />
      <div className='w-fit h-fit flex flex-col items-center justify-center'>
        <TabButtons 
        leftLabel={"Lot machine"}
        rightlabel={"Referral"}
        />
        <CardFrame
        wide
        >

        </CardFrame>
      </div>
    </div>
  )
}

export default page