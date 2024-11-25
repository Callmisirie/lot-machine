"use client"

import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import React, { useState } from 'react'
import { planBenefits } from '.'
import PaymentDurationPill from '@/components/account/PaymentDurationPill'

const page = () => {
  const [paymentDurationState, setPaymentDurationState] = useState("Month");
  return (
    <div className='w-full h-fit flex flex-col justify-center items-center gap-[32px]'>
      <Header 
      title={"Plans"}
      text={"Simple, transparent and enjoyable"}
      />
      <div className='w-fit h-fit flex flex-wrap gap-[32px] items-center justify-center'>
        <CardFrame>
          <div className='w-full h-full 
          flex flex-col justify-between 
          items-start'>
            <div className='flex flex-col w-full h-fit items-start'>
              <h3 className='h3 text-n-700'>Free</h3>
              <div className='flex flex-col gap-2 w-fit h-fit'>
                {planBenefits.free.map((benefit, idx) => {
                  return (
                    <p 
                    key={idx}
                    className='p3b text-n-500'>
                      {benefit}
                    </p>  
                  ) 
                })}
              </div>
            </div>
            <div className='w-fit h-fit flex flex-col gap-2 items-start'>
                <div className='w-fit flex items-center gap-2'>
                  <h3 className='h3 text-n-900'>
                    $0 
                  </h3>
                  <h5 className='h5 text-n-500'>/month</h5>
                </div>
                <div
                className={`flex items-center 
                justify-center bg-white w-[146px] 
                h-[48px] cursor-default
                rounded-[16px] border border-n-300`}>
                  <p className='text-n-900 l3b'>
                    Your current plan
                  </p>
                </div>            
            </div>
          </div>
        </CardFrame>
        <CardFrame>
          <div className='w-full h-full 
          flex flex-col justify-between 
          items-start relative'>
            <PaymentDurationPill 
            paymentDurationState={paymentDurationState}
            setPaymentDurationState={setPaymentDurationState}
            />
            <div className='flex flex-col w-full h-fit items-start'>
              <h3 className='h3 text-n-700'>Pro</h3>
              <div className='flex flex-col gap-2 w-fit h-fit'>
                {planBenefits.pro.map((benefit, idx) => {
                  return (
                    <p 
                    key={idx}
                    className='p3b text-n-500'>
                      {benefit}
                    </p>  
                  ) 
                })}
              </div>
            </div>
            <div className='w-fit h-fit flex flex-col gap-2 items-start'>
                <div className='w-fit flex items-center gap-2'>
                  <h3 className='h3 text-n-900'>
                    {paymentDurationState === "Month" ? "$10" : "$100"} 
                  </h3>
                  <h5 className='h5 text-n-500'>/{paymentDurationState}</h5>
                </div>
                <div
                className={`flex items-center 
                justify-center bg-n-900 w-[146px] 
                h-[48px] cursor-pointer
                rounded-[16px]`}>
                  <p className='text-n-100 l3b'>
                    Upgrade to pro
                  </p>
                </div>            
            </div>
          </div>
        </CardFrame>
      </div>
    </div>
  )
}

export default page