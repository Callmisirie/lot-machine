"use client"

import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import TabButtons from '@/components/account/TabButtons'
import React, { useState } from 'react'

const page = () => {
  const [tabButtonState, setTabButtonState] = useState("Lot machine")
  return (
    <div className='w-full h-fit flex flex-col justify-center items-center gap-[32px]'>
      <Header 
      title={"How it works"}
      text={"Simple, transparent and enjoyable"}
      />
      <div className='w-fit h-fit flex flex-col items-center justify-center'>
        <TabButtons 
        leftLabel={"Lot machine"}
        rightlabel={"Referral"}
        tabButtonState={tabButtonState}
        setTabButtonState={setTabButtonState}
        howItWorks
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