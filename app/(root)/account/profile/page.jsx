"use client"

import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import ValueField from '@/components/account/ValueField'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React from 'react'

const fetchUserInfo = async (email) => {
  const res = await fetch(`/api/getUserInfo?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
};

const page = () => {
  const {isAuthenticated, user} = useKindeBrowserClient();
  const {
    data: userInfo,
    isLoading: userInfoLoading,
  } = useQuery({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => await fetchUserInfo(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

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
      <div className='w-full h-fit 
      flex flex-col justify-center 
      items-center gap-[32px]'>
        <Header 
        title={"Profile"}
        text={"Simple, transparent and enjoyable"}
        />
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
                      Pro
                    </p>
                  </div>
                  <div className='w-fit h-fit flex gap-2 items-center'>
                    <p className='p2b text-n-700'>
                      Expires: <span className='p3r text-n-500'>21/11/2024</span>
                    </p>
                  </div>
                </div>
                <button className='w-fit p3b text-accent-red-300 cursor-pointer'>
                  Cancel subscription
                </button>
              </div>
            </div>
          </div>
        </CardFrame>
      </div>
    )
  }
}

export default page