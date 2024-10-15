"use client";

import checkUserAuth from '@/actions/checkUserAuth';
import paths from '@/common/paths'
import Button from '@/components/Button'
import { lmImage, lmLogo } from '@/public'
import { google } from '@/public/icons'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && checkUserAuth(session?.user?.email)) {
      redirect(paths.home());
    }
  }, [status]);

  return (
    <main className='h-screen relative'>
      <div className='flex items-end 
      w-fit h-fit relative left-8 top-8'>
        <Image 
          src={lmLogo} 
          width={98} 
          height={98} 
          alt='logo'
          className="md:w-[98px] md:h-[98px] 
          max-md:w-[38px] max-md:h-[40px]
          transition-all duration-300"
          />
        <h3 className='h3r text-n-700'>Lot machine</h3>     
      </div>
      <h2 className='h2r text-n-700 absolute 
      left-[32px] md:top-[304px] xl:max-w-[741px] lg:max-w-[490px]
      max-md:w-[278px] z-10 max-md:top-[120px]
      md:invisible lg:visible'>
      Enjoy the full <span className='h1r'>benefits </span>of
      your trading <span className='h1r'>positions</span>.
      </h2>
      <div className='fixed left-[32px] 
      md:top-[304px] max-md:top-[120px]
      transition-all duration-300'>
        <Image 
          src={lmImage} 
          width={950} 
          height={680} 
          alt='lm bg image'
          className="md:w-[950px] md:h-680px] 
          max-md:w-[370px] max-md:h-[264px]
          transition-all duration-300"
          />         
      </div>
      <div className='flex h-full w-[480px] 
      max-md:w-full max-md:h-[560px] max-md:bottom-0
      bg-n-700 md:rounded-s-[56px] fixed 
      max-md:rounded-t-[32px] right-0 md:top-0 
      justify-center items-center z-10 transition-all duration-300'>
        <div className='flex flex-col 
        gap-[64px] absolute
        h-fit'>
          <div className='flex flex-col items-center gap-[56px]'>
            <div  className='flex flex-col items-center'>
              <h2 className='h2 text-n-500'>Sign in</h2>
              <p className='p2b text-n-100'>Already have an account with us?</p>              
            </div>
            <Button 
              leftIcon 
              leftIconImgSrc={google} 
              label="Continue with google"/>
          </div>
          <div className='flex items-center gap-4'>
            <div className='w-full bg-n-500 h-[2px] rounded-[32px]'/>
              <p className='p2r text-n-500'>or</p>
            <div className='w-full bg-n-500 h-[2px] rounded-[32px]'/>
          </div>
          <div className='flex flex-col items-center gap-[16px]'>
            <p className='p2r text-n-300'>Don't have an account?</p>              
            <Button 
              leftIcon 
              leftIconImgSrc={google} 
              label="Sign up with google"
              buttonColor="bg-n-100"
              />
          </div>
        </div>
      </div>     
    </main>
  )
}

export default page