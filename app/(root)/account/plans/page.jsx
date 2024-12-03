"use client"

import Header from '@/components/account/Header'
import React from 'react'
import { Loader } from 'lucide-react'
import { CarouselFrame } from '@/components/account/CarouselFrame'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

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

  if (userInfo && userInfo.plan === "Master") {
    router.push("/account/profile");
  }  

  if (!userInfo || subscriptionsLoading) {
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

  if (userInfo && !subscriptionsLoading && subscriptions.success && userInfo.plan !== "Master") {  
    return (
      <div className='w-full h-fit flex flex-col justify-center items-center gap-[32px]'>
        <Header 
        title={"Plans"}
        text={"Simple, transparent and enjoyable"}
        />
        <div className='w-fit h-fit flex flex-wrap gap-[32px] items-center justify-center'>
          <CarouselFrame subscriptionRefetch={subscriptionRefetch}/>
        </div>
      </div>
    )
  }
}

export default page