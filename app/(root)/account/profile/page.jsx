"use client"

import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import ValueField from '@/components/account/ValueField'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react'
import useResizeObserver from "use-resize-observer";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { homeWhite } from '@/public/icons/white';

const fetchSubscriptions = async (email) => {
  const res = await fetch(`/api/getSubscriptions?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  const { success, paymentPlanId, subscriptions } = await res.json();
  return {success, paymentPlanId, subscriptions}
};

const cancelSubscription = async (email) => {
  const res = await fetch(`/api/cancelSubscription?email=${encodeURIComponent(email)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to cancel subsciption");
  const response = await res.json();
  return { status: response.status, message: response.message, data: response.data };
};

const page = () => {
  const {isAuthenticated, user} = useKindeBrowserClient();
  const queryClient = useQueryClient();
  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
  } = useQuery({
    queryKey: ["subscriptions", user?.email],
    queryFn: async () => await fetchSubscriptions(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const userInfo = queryClient.getQueryData(["userInfo", user?.email]);
  const { ref, height } = useResizeObserver();  

  if (!userInfo || subscriptionsLoading) {
    return (
      <div className='w-full h-full 
      flex flex-col justify-center 
      items-center gap-[32px]'
      ref={ref}>
        {height > 560 && (
          <div className='w-fit h-fit 
          flex flex-col 
          justify-center items-center 
          gap-[20px]'>
            <Skeleton
            className="w-[153px] h-[52px]
            bg-n-300/25 rounded-[8px] relative" />
            <Skeleton
            className="w-[278px] h-[20px]
            bg-n-300/25 rounded-[4px] " />
          </div>
        )}
        <Skeleton
        className="w-[300px] h-[420px]
        bg-n-300/25 rounded-[32px]" />
      </div>
    );
  }

  if (userInfo && !subscriptionsLoading) {
    const latestSubscription = () => {
      if (!subscriptionsLoading && subscriptions.success && subscriptions.subscriptions) {
        const latest = subscriptions?.subscriptions[subscriptions?.subscriptions?.length - 1];
        const subscriptionEndDate = format(new Date(latest?.endDate), 'dd/MM/yyyy');
        const payment_type = latest?.payment_type
  
        return {subscriptionEndDate, payment_type};
      } else {
        return "********";
      }
    }

    return (
      <div className='w-full h-full 
      flex flex-col justify-center 
      items-center gap-[32px] relative'
      ref={ref}>
        <div className='w-[48px] h-[48px] 
        bg-n-900 cursor-pointer rounded-full
        flex justify-center items-center absolute 
        left-8 top-8 max-md:left-4 max-md:top-2 
        transition-all duration-300'>
          <Link href={"/"}>
            <Image
              src={homeWhite}
              width={24}
              height={24}
              alt='cancel icon'
              priority
            />
          </Link>
        </div>   
        {height > 560 && (
          <Header 
          title={"Profile"}
          text={"Simple, transparent and enjoyable"}
          />
        )}
        <CardFrame>
          <div className='w-full h-full 
          flex flex-col justify-between 
          items-center'>
            <div className='flex flex-col w-full h-fit'>
              <h3 className='h3 text-n-700'>Profile details</h3> 
              <p className='p3b text-n-500 w-[163px] h-fit'>
                Personalized info about your account 
              </p>
            </div>
            <div className='flex w-fit h-fit flex-col gap-2'>
              <ValueField 
              label={"Name"}
              value={userInfo?.name}
              />
              <ValueField 
              label={"Username"}
              value={userInfo?.username}
              copy
              />
            </div>
            <div className='w-full h-fit 
            flex flex-col gap-2 border 
            border-n-300 p-4 rounded-[16px]'>
              <div className='w-full h-fit flex flex-col gap-4 justify-start'>
                <div className='flex flex-col w-full h-fit gap-2'>
                  <div className='w-fit h-fit flex gap-1 items-center'>
                    <p className='p1b text-n-700'>Current plan:</p>
                    <p className='p3b text-n-500'>
                      {userInfo.plan}
                    </p>
                  </div>
                  {userInfo?.plan === "Pro" && (
                  <div className='w-fit h-fit flex gap-2 items-center'>
                    <p className='p2b text-n-700'>
                      Expires: <span className='p3r text-n-500'>{latestSubscription?.().subscriptionEndDate}</span>
                    </p>
                  </div>)}
                </div>
                {latestSubscription?.().payment_type === 'card' && subscriptions.paymentPlanId ? (
                  <button className={`w-fit p3b text-accent-red-300 cursor-pointer`}
                  onClick={async() => {
                    await cancelSubscription(userInfo?.email);
                    await queryClient.invalidateQueries("beneficiary");
                  }}>
                    Cancel subscription
                  </button>) 
                : null}
              </div>
            </div>
          </div>
        </CardFrame>
      </div>
    )
  }
}

export default page