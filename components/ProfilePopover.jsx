"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AvatarProfile } from "./Avatar";
import Image from "next/image";
import { sOut } from "@/public/icons";
import Pill from "./Pill";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { userBlack } from "@/public/icons/black";
import Link from "next/link";

export function ProfilePopover() {
  const {user} = useKindeBrowserClient();
  const initName = user?.given_name.charAt(0).toUpperCase() + user?.family_name.charAt(0).toUpperCase();

  

  return (
    <Popover>
      <PopoverTrigger><AvatarProfile imgSrc={user?.picture} initName={isNaN(initName) ? "" : initName}/></PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col items-center justify-center gap-4">
          <Pill 
            blackPill
            content={"Free"}
          />
          <div className="flex flex-col items-center justify-center gap-8">
            <form className="">
              <Button type="submit" 
                variant="customGhost"
                className="l3r text-n-700">
                  Account
                  <Image 
                    src={userBlack} 
                    width={24} 
                    height={24} 
                    alt="account" 
                    className="ml-2"
                    priority
                    />
              </Button>        
            </form>
            <Link
            rel='noreferrer noopener'
            href='/api/auth/logout'>
              <Button variant="customGhost"
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
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}