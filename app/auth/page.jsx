import Button from '@/components/Button'
import { lmLogo } from '@/public'
import { google } from '@/public/icons'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <main className='h-screen absolute'>

        <div className='flex items-end w-fit h-fit fixed left-8 top-8'>
          <Image 
            src={lmLogo} 
            width={98} 
            height={98} 
            alt='logo'
            priority
            />   
            <h3 className='h3 text-n-700'>Lot machine</h3>     
        </div>
      
      <div className='flex h-full w-[480px] 
      bg-n-700 rounded-s-[56px] fixed 
      right-0 justify-center'>
        <div className='flex flex-col gap-[64px] relative top-[192px] h-fit'>
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