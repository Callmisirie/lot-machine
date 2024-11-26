"use client"

import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import TabButtons from '@/components/account/TabButtons'
import { search } from '@/public/icons'
import Image from 'next/image'
import React, { useState } from 'react'

const page = () => {
  const [tabButtonState, setTabButtonState] = useState("Lot machine")

  const howItWorksContent = () => {
    if (tabButtonState === "Lot machine") {
      return (
        <div className='w-full h-full 
        flex flex-col gap-8
        items-start'>
          <div
          className={`flex justify-start w-[147px]
          items-center border border-n-500 px-2
          bg-transparent rounded-[8px] h-[32px] 
          `}>
            <Image
              src={search}
              width={24}
              height={24}
              alt='search icon'
              priority
            />
            <p className="l2r text-n-500">
              Search
            </p>
          </div>         
          <div className='w-full h-full flex flex-col gap-4 items-start'>
            <div className='w-full h-fit flex flex-col items-start'>
              <h4 className='h4 text-n-700'>Partials</h4>
              <p className='p3r text-n-500'>
                This is a collection of partial TPs for a position.
              </p>
            </div>
            <div className='w-full h-fit flex flex-col items-start'>
              <h4 className='h4 text-n-700'>Machine</h4>
              <p className='p3r text-n-500'>
                Offload your position by calculation your partial targets.
              </p>
            </div>
          </div>
        </div>
      )
    }
    if (tabButtonState === "Referral") {
      return (
        <div className='w-full h-full 
        flex flex-col gap-8
        items-start'>
          <div
          className={`flex justify-start w-[147px]
          items-center border border-n-500 px-2
          bg-transparent rounded-[8px] h-[32px] 
          `}>
            <Image
              src={search}
              width={24}
              height={24}
              alt='search icon'
              priority
            />
            <p className="l2r text-n-500">
              Search
            </p>
          </div>         
          <div className='w-full h-full flex flex-col gap-4 items-start'>
            <div className='w-full h-fit flex flex-col items-start'>
              <h4 className='h4 text-n-700'>Referral split</h4>
              <p className='p3r text-n-500'>
              Get reoccurring earnings from your referral.
              </p>
            </div>
            <div className='w-full h-fit flex flex-col items-start'>
              <h4 className='h4 text-n-700'>Referral stages</h4>
              <p className='p3r text-n-500'>
                Three split share stages.
              </p>
            </div>
          </div>
        </div>
      )
    }
  }
  return (
    <div className='w-full h-fit flex flex-col justify-center items-center gap-[32px]'>
      <Header 
      title={"How it works"}
      text={"Simple, transparent and enjoyable"}
      />
      <CardFrame
      wide
      >
        <TabButtons 
        topLabel={"Lot machine"}
        bottomLabel={"Referral"}
        tabButtonState={tabButtonState}
        setTabButtonState={setTabButtonState}
        howItWorks
        />
        {howItWorksContent()}
      </CardFrame>
    </div>
  )
}

export default page