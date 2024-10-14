"use client";

import Image from 'next/image';
import { lmLogo } from '@/public';
import { ProfilePopover } from './ProfilePopover';

const Navbar = () => {


  return (
    <div className='w-full flex justify-between p-[32px] h-fit absolute'>
      <div className='flex items-end'>
        <Image 
          src={lmLogo} 
          width={98} 
          height={98} 
          alt='logo'
          priority
          />   
          <h3 className='h3 text-n-700'>Lot machine</h3>     
      </div>
        <ProfilePopover />
    </div>
  )
}

export default Navbar