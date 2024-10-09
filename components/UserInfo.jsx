"use client";
 
import Image from 'next/image';
import SignInBtn from './SignInBtn';
import { useSession } from 'next-auth/react';

const UserInfo = () => {
  const {status, data: session} = useSession();

  return (
    (status !== "loading" ? 
      status === "authenticated" ?
      <div className='flex flex-col 
      p-8 shadow-xl rounded-xl gap-4 items-center'>
       <Image src={session?.user?.image} width={60} height={60}  className='rounded-full'/>
        <div>
          Name: <span className='font-bold'>{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className='font-bold'>{session?.user?.email}</span>
        </div>
      </div>
      : <SignInBtn />
    : null) 
  )
}

export default UserInfo