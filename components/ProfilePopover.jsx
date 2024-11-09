"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AvatarProfile } from "./Avatar"
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import { sOut, user } from "@/public/icons";
import Pill from "./Pill";

export function ProfilePopover() {
  const {status, data: session} = useSession();
  const initName = session?.user?.name.split(' ')
  .map(word => word.charAt(0).toUpperCase())
  .join('');

  return (
<Popover>
  <PopoverTrigger><AvatarProfile imgSrc={session?.user?.image} initName={initName}/></PopoverTrigger>
  <PopoverContent>
    <div className="flex flex-col items-center justify-center gap-4">
      <Pill 
        blackPill
        partialTP={"Free"}
      />
      <div className="flex flex-col items-center justify-center gap-8">
        <form className="">
          <Button type="submit" 
            variant="customGhost"
            className="l3r text-n-700">
              Account
              <Image 
                src={user} 
                width={24} 
                height={24} 
                alt="account" 
                className="ml-2"
                priority
                />
          </Button>        
        </form>
        <form action={signOut}>
          <Button type="submit" 
            variant="customGhost"
            className="l2b text-accent-red-300">
              Sign out
              <Image 
                src={sOut} 
                width={24} 
                height={24} 
                alt="sign out" 
                className="ml-2"
                priority
                />
          </Button>        
        </form>           
      </div>
    </div>
  </PopoverContent>
</Popover>
  )
}