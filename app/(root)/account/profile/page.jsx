import CardFrame from '@/components/account/CardFrame'
import Header from '@/components/account/Header'
import ValueField from '@/components/account/ValueField'
import React from 'react'

const page = () => {
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
            value={"Isirimah Kennedy"}
            />
            <ValueField 
            label={"Username"}
            value={"kensirie3259"}
            />
          </div>
          <div className='w-full h-fit 
          flex flex-col gap-2 border 
          border-n-300 p-4 rounded-[16px]'>
            <div className='w-full h-fit flex flex-col gap-4 justify-start'>
              <div className='flex flex-col w-full h-fit gap-2'>
                <div className='w-fit h-fit flex gap-2 items-center'>
                  <p className='p1b text-n-700'>Current plan:</p>
                  <p className='p3b text-n-500'>
                    Pro - <span className='p3r text-n-500'>Monthly</span>
                  </p>
                </div>
                <div className='w-fit h-fit flex gap-2 items-center'>
                  <p className='p2b text-n-700'>
                    Expires: <span className='p3r text-n-500'>21/11/2024</span>
                  </p>
                </div>
              </div>
              <button className='w-fit p3b text-accent-red-300'>
                Cancel subscription
              </button>
            </div>
          </div>
        </div>
      </CardFrame>
    </div>
  )
}

export default page