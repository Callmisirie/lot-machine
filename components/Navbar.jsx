"use client";

import Image from 'next/image';
import { lmLogo } from '@/public';
import { ProfilePopover } from './ProfilePopover';

const Navbar = () => {


  return (
    <div className='w-full fixed top-0 bg-white'>
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
          <ProfilePopover />
      </div>      
    </div>

  )
}

export default Navbar