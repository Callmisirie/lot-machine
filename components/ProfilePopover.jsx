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

export function ProfilePopover() {
  const {status, data: session} = useSession();
  const initName = session?.user?.name.split(' ')
  .map(word => word.charAt(0).toUpperCase())
  .join('');

  return (
<Popover>
  <PopoverTrigger><AvatarProfile imgSrc={session?.user?.image} initName={initName}/></PopoverTrigger>
  <PopoverContent>
    <div className="flex flex-col items-center gap-4">
      <form >
        <Button type="submit" 
          variant="custom"
          className="l3r text-n-700">
            Account
            <Image 
              src={user} 
              width={24} 
              height={24} 
              alt="account" 
              className="ml-2"
              />
        </Button>        
      </form>
      <form action={signOut}>
        <Button type="submit" 
          variant="custom"
          className="l2b text-accent-red-300">
            Sign out
            <Image 
              src={sOut} 
              width={24} 
              height={24} 
              alt="sign out" 
              className="ml-2"
              />
        </Button>        
      </form>      
    </div>

  </PopoverContent>
</Popover>
  )
}