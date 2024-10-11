"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AvatarProfile } from "./Avatar"
import { signIn, signOut, useSession } from 'next-auth/react';

export function PopoverProfile() {
  const {status, data: session} = useSession();
  const initName = session?.user?.name.split(' ')
  .map(word => word.charAt(0).toUpperCase())
  .join('');

  return (
<Popover>
  <PopoverTrigger><AvatarProfile imgSrc={session?.user?.image} initName={initName}/></PopoverTrigger>
  <PopoverContent>
    <form action={signOut}>
      <Button type="submit" 
        variant="custom"
        className="l2b text-accent-red-300">
          sign out
      </Button>        
    </form>
  </PopoverContent>
</Popover>

  )
}