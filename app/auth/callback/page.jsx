"use client";

import { lmLogo } from "@/public";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import paths from "@/common/paths";
import { useEffect, useState } from "react";
import userAuth from "@/actions/user";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

const fetchUserInfo = async (email) => {
  const res = await fetch(`/api/getUserInfo?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
};

const Page = () => {
  const router = useRouter();
  const [referralId, setReferralId] = useState("isLoading");
  const {isAuthenticated, user} = useKindeBrowserClient();

  // Safely access localStorage on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedReferralId = localStorage.getItem("referralId");
      setReferralId(storedReferralId || "none");
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["userAuth", referralId],
    queryFn: async () => await userAuth(referralId)
  });

  const {
    data: userInfo,
    isLoading: userInfoLoading,
  } = useQuery({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => await fetchUserInfo(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  
  if(data?.success && !isLoading && userInfo && !userInfoLoading) {
    localStorage.removeItem("referralId");
    router.push(paths.home());
  }

  if (!data?.success && !isLoading && !data?.isLoading) {
    router.push("/api/auth/logout");
  }

	return (
		<div className='w-full h-full flex flex-col justify-between items-center relative'>
      <div className='w-full bg-white'>
        <div className='w-full flex justify-between p-[32px] h-fit bg-custom-opacity-15'>
          <div className='flex items-end'>
            <Image 
              src={lmLogo} 
              width={98} 
              height={98} 
              alt='logo'
              className="md:w-[98px] md:h-[98px] 
              max-md:w-[38px] max-md:h-[40px]
              transition-all duration-300"
              priority
              />
              <h3 className='h3r text-n-700'>Lot machine</h3>     
          </div>
        </div>      
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className='flex flex-col items-center gap-2'>
          <Loader className='w-10 h-10 animate-spin text-primary' />
          <h3 className='text-xl font-bold'>Redirecting...</h3>
          <p>Please wait...</p>
        </div>
      </div>
		</div>
	);
};
export default Page;