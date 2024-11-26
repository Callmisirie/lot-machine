"use client";

import { lmLogo } from "@/public";
import { Loader } from "lucide-react";
import Image from "next/image";
import { checkAuthStatus } from "./action";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import paths from "@/common/paths";

const Page = () => {
  const router = useRouter();
	const { data, isLoading } = useQuery({
		queryKey: ["checkAuthStatus"],
		queryFn: async () => await checkAuthStatus(),
	});

  if(data?.success && !isLoading) {
    router.push(paths.home());
  }

  if (!data?.success && !isLoading) {
    router.push("/api/auth/logout")
  }

	return (
		<div className='w-full h-full flex justify-center items-center relative'>
      <div className='flex items-end 
      w-fit h-fit absolute left-8 top-8 cursor-default'>
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
			<div className='flex flex-col items-center gap-2'>
				<Loader className='w-10 h-10 animate-spin text-primary' />
				<h3 className='text-xl font-bold'>Redirecting...</h3>
				<p>Please wait...</p>
			</div>
		</div>
	);
};
export default Page;