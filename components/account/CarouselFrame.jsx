"use client"

import React, { useState } from 'react'
import PaymentDurationPill from '@/components/account/PaymentDurationPill'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid';
import pLimit from 'p-limit';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { planBenefits } from "@/app/(root)/account/plans"
import CardFrame from "./CardFrame"
import { inEarnings } from '@/actions/earnings';
import storeProcessedEvent from '@/actions/StoreProcessedEvent';
import addSubscription from '@/actions/addSubscription';

const FLUTTERWAVE_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
const TEST_FLUTTERWAVE_PUBLIC_KEY = process.env.NEXT_PUBLIC_TEST_FLUTTERWAVE_PUBLIC_KEY;


export function CarouselFrame() {
  const {user} = useKindeBrowserClient();
  const queryClient = useQueryClient();
  const [paymentDurationState, setPaymentDurationState] = useState("Month");
  const uniqueId = uuidv4();
  const subscriptions = queryClient.getQueryData(["subscriptions", user?.email]);
  const userInfo = queryClient.getQueryData(["userInfo", user?.email]);
  const formatter = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  });
  // Initialize p-limit with concurrency 1
  const limit = pLimit(1);

  const amount = 200;
  const getPaymentType = (duration) => {
    const firstPayment = () => {
      if (subscriptions?.success) {
        const numberOfSubscription = subscriptions?.subscriptions?.length;
        if (!numberOfSubscription) {
          return true;
        } else if (numberOfSubscription > 0) {
          return false;
        }
      } else {
        return false;
      }
    }
    
    if (duration === "Month") {
      if (userInfo?.referralId) {
        if (firstPayment()) {
          return {amount: amount * 0.5, paymentPlan: 70900};
        } else {
          return {amount: amount, paymentPlan: 70900};
        }
      } else {
        return {amount: amount, paymentPlan: 70900};
      }
    }
    if (duration === "Year") {
      return {amount: amount * 10, paymentPlan: 70901};
    }
  }
  const config = {
    public_key: TEST_FLUTTERWAVE_PUBLIC_KEY ,
    tx_ref: uniqueId,
    amount: getPaymentType(paymentDurationState).amount,
    currency: 'NGN',
    payment_plan: getPaymentType(paymentDurationState).paymentPlan,
    customer: {
      email: userInfo?.email,
      name: userInfo?.name,
      phone_number: '***********',
    }, 
    meta: { 
      duration: paymentDurationState
    },
    customizations: {
      title: 'Lot Machine',
      description: paymentDurationState === "Month" 
      ? 'Pro plan monthly subscription' 
      : 'Pro plan yearly subscription',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = async (response) => {
        if (response.charge_response_code === "00" && response.status === "completed" ||
          response.charge_response_code === "00" && response.status === "successful"
        ) {
          console.log("Payment completed immediately: ", response);
          
          const {customer: {email}, tx_ref: flwRef, amount, transaction_id: id} = response;
          const data = {customer: {email}, flwRef, amount, id}

           // Modify the storeProcessedEvent to use p-limit
          const limitedStoreProcessedEvent = (data) => limit(() => storeProcessedEvent(data));
          const storedProcessedEvent = await limitedStoreProcessedEvent(data);

          if (storedProcessedEvent?.success && storedProcessedEvent?.stored) {
            console.log("Duplicate found");
          } else {
            await inEarnings(data);
            await addSubscription(data);
          }
          await queryClient.invalidateQueries("userInfo");
          await queryClient.invalidateQueries("subscriptions");
        } else if (response.status === "pending") {
          console.log("Payment is pending verification");
          // Optionally notify the user of the delay
        } else {
          console.log("Payment failed");
          // Handle failure case
        }     
  }

  return (
    <Carousel className="w-[301px]">
      <CarouselContent>
        <CarouselItem >
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
                      &#8358;{formatter.format(getPaymentType(paymentDurationState).amount)} 
                    </h3>
                    <h5 className='h5 text-n-500'>/{paymentDurationState}</h5>
                  </div>
                  <button
                  className={`flex items-center 
                  justify-center  w-[146px] h-[48px] rounded-[16px]
                  ${userInfo && userInfo?.plan !== "Pro"
                    ? "cursor-pointer bg-n-900" 
                    : "cursor-not-allowed bg-n-700"}`}>
                    <p className='text-n-100 l3b'
                    onClick={() => {
                      if (userInfo && userInfo?.plan !== "Pro") {
                        handleFlutterPayment({
                          callback: async (response) => {
                            await handlePayment(response);                                                        
                            closePaymentModal()
                          },
                          onClose: () => {},
                        });
                      }
                    }}>
                      {userInfo?.plan === "Pro" ? "Your current plan" : "Upgrade to pro"}
                    </p>
                  </button>            
              </div>
            </div>
          </CardFrame>          
        </CarouselItem>       
        <CarouselItem >
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
                      &#8358;0 
                    </h3>
                    <h5 className='h5 text-n-500'>/month</h5>
                  </div>
                  <div
                  className={`flex items-center 
                  justify-center bg-white w-[146px] 
                  h-[48px] cursor-default
                  rounded-[16px] border border-n-300`}>
                    <p className='text-n-900 l3b'>
                      {userInfo?.plan === "Free" ? "Your current plan" : "Plan features"}
                    </p>
                  </div>            
              </div>
            </div>
          </CardFrame>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
