"use client";

import Image from 'next/image'
import React from 'react'
import { signIn } from 'next-auth/react';

const SignInBtn = () => {
  return (
    <button className='flex items-center 
    gap-4 p-4 text-black bg-white 
    rounded-2xl shadow-xl hover:bg-black/5'
    onClick={() => signIn("google")}>
      <Image src={"/icons/google.svg"} width={48} height={48}/>
      Sign in with Google
    </button>
  )
}

export default SignInBtn