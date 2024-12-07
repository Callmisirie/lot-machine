"use client"

import Header from '@/components/account/Header'
import React, { useEffect } from 'react'
import { CarouselFrame } from '@/components/account/CarouselFrame'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import useResizeObserver from "use-resize-observer";
import { Skeleton } from '@/components/ui/skeleton';
import Pusher from 'pusher-js';


const fetchSubscriptions = async (email) => {
  const res = await fetch(`/api/getSubscriptions?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch subscriptions");
  const { success, subscriptions } = await res.json();
  return {success, subscriptions};
};

const page = () => {
  const {isAuthenticated, user} = useKindeBrowserClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
    refetch: subscriptionRefetch
  } = useQuery({
    queryKey: ["subscriptions", user?.email],
    queryFn: async () => await fetchSubscriptions(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const userInfo = queryClient.getQueryData(["userInfo", user?.email]);
  const { ref, height } = useResizeObserver(); 
  
  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(pusherKey, {
      cluster: 'mt1',
      encrypted: true,
    });

    // Subscribe to the channel and bind to the event
    const channel = pusher.subscribe('card-bank-channel');
    channel.bind('transaction-event', async (data) => {
      console.log('Received data:', data);
      if (data.data.status === "successful") {
        await queryClient.invalidateQueries("userInfo");
        await queryClient.invalidateQueries("subscriptions");
      }
    });

    return () => {
      pusher.unsubscribe('card-bank-channel');
    };
  }, []);
  
  
  if (userInfo && userInfo.plan === "Master") {
    router.push("/account/profile");
  }  

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
            bg-n-100 rounded-[8px] relative" />
            <Skeleton
            className="w-[278px] h-[20px]
            bg-n-100 rounded-[4px] " />
          </div>
        )}
        <Skeleton
        className="w-[300px] h-[420px]
        bg-n-100 rounded-[32px]" />
      </div>
    );
  }

  if (userInfo && !subscriptionsLoading && subscriptions.success && userInfo.plan !== "Master") {  
    return (
      <div className='w-full h-full flex flex-col justify-center items-center gap-[32px]'
      ref={ref}>
        {height > 560 && (
          <Header 
          title={"Plans"}
          text={"Simple, transparent and enjoyable"}
          />
        )}
        <div className='w-fit h-fit flex flex-wrap gap-[32px] items-center justify-center'>
          <CarouselFrame />
        </div>
      </div>
    )
  }
}

export default page