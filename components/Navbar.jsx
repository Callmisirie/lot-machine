"use client";

import Image from 'next/image';
import { lmLogo } from '@/public';
import { ProfilePopover } from './ProfilePopover';
import Link from 'next/link';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useQueryClient } from '@tanstack/react-query';

const Navbar = () => {
  const {user} = useKindeBrowserClient();
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData(["userInfo", user?.email]);
  return (
    <div className='w-full bg-white'>
      <div className='w-full flex justify-between p-[32px] h-fit bg-custom-opacity-15'>
        <Link href={"/"}>
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
        </Link>
        <div className='w-fit h-fit flex items-center'>
          {userInfo && userInfo.plan === "Free" 
          ? <Link href={"/account/plans"}
            className='relative -right-2'>
              <div className='flex justify-center 
              items-center w-[146px] h-[48px] p-4
              rounded-tl-[16px] rounded-bl-[16px]
              bg-n-900 shadow-md'>
                  <p className='l3b text-n-100'>Get pro plan</p>     
              </div>
            </Link>
          : null}
          <ProfilePopover />
        </div>
      </div>      
    </div>
  )
}

export default Navbar