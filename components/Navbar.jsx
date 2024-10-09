"use client";

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const {status} = useSession();

  return (
    <div className='flex justify-between 
    items-center p-4 shadow-md rounded-xl'>
      <Link href={"/"} className='font-semibold'>Lot machine</Link>
      {status !== "loading" ? 
        status === "authenticated" ?
          <button className="bg-black
          text-white rounded-xl py-2 px-4"
          onClick={() => signOut()}> 
            sign out
          </button>
          :<button className="bg-black 
          text-white rounded-xl py-2 px-4"
          onClick={() => signIn("google")}> 
            sign in
          </button> 
      : null}
    </div>
  )
}

export default Navbar