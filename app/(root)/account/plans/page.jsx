"use client"

import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import React, { useState } from 'react'
import { planBenefits } from '.'
import PaymentDurationPill from '@/components/account/PaymentDurationPill'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'

const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_ENCRYPTION_KEY = process.env.FLUTTERWAVE_ENCRYPTION_KEY;

const fetchUserInfo = async (email) => {
  const res = await fetch(`/api/getUserInfo?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
};

const page = () => {
  const {isAuthenticated, user} = useKindeBrowserClient();
  const [paymentDurationState, setPaymentDurationState] = useState("Month");

  const {
    data: userInfo,
    isLoading: userInfoLoading,
  } = useQuery({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => await fetchUserInfo(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  
  const config = {
    public_key: "FLWPUBK-4f4bfc9dcfdfcf0476e6db13f75f25ae-X",
    tx_ref: Date.now(),
    amount: paymentDurationState === "Month" ? 100 : 1000,
    currency: 'NGN',
    customer: {
      email: userInfo?.email,
      name: userInfo?.name,
    },
    customizations: {
      title: 'Lot Machine',
      description: paymentDurationState === "Month" 
      ? 'Pro plan monthly subcription' 
      : 'Pro plan yearly subcription',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  if (userInfoLoading || !userInfo) {
    return (
      <div className="w-full h-full flex justify-center items-center relative">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-10 h-10 animate-spin text-primary" />
          <h3 className="text-xl font-bold">Loading...</h3>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (!userInfoLoading && userInfo) {
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
                  <button
                  className={`flex items-center 
                  justify-center  w-[146px] h-[48px] rounded-[16px]
                  ${userInfo 
                    ? "cursor-pointer bg-n-900" 
                    : "cursor-not-allowed bg-n-700"}`}>
                    <p className='text-n-100 l3b'
                    onClick={() => {
                      if (userInfo) {
                        handleFlutterPayment({
                          callback: (response) => {
                            console.log(response);
                            closePaymentModal()
                          },
                          onClose: () => {},
                        });
                      }
                    }}>
                      Upgrade to pro
                    </p>
                  </button>            
              </div>
            </div>
          </CardFrame>
        </div>
      </div>
    )
  }
}

export default page