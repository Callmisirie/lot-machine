"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current pathname
  const {user} = useKindeBrowserClient();
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData(["userInfo", user?.email]);

  const sidebarContent = () => {
    if (!userInfo) {
      return (
        <div className={`w-full h-full 
        flex flex-col justify-start 
        items-start gap-[58px] py-[32px]`}>
          {Array.from({length: 4}).map((_, index) => (
            <Skeleton key={index}
            className="w-full h-[36px] rounded-[8px] bg-n-100" />
          ))}
      </div>
      );
    } 

    if (userInfo ) {
      return (
        <div className={`w-full h-fit flex flex-col gap-[58px] py-[32px]`}>
        <Link href={"/account/profile"}>
          <h4 className={`h4 ${pathname === "/account/profile" ? "text-n-700" : "text-n-500"}`}>
            Profile
          </h4>
        </Link>
        {userInfo.plan !== "Master" && (
          <Link href={"/account/plans"}>
            <h4 className={`h4 ${pathname === "/account/plans" ? "text-n-700" : "text-n-500"}`}>
              Plans
            </h4>
          </Link>
        )}
        {userInfo.plan !== "Master" && (
        <Link href={"/account/referral"}>
          <h4 className={`h4 ${pathname === "/account/referral" ? "text-n-700" : "text-n-500"}`}>
            Referral
          </h4>
        </Link>
        )}
        <Link href={"/account/how-it-works"}>
          <h4 className={`h4 ${pathname === "/account/how-it-works" ? "text-n-700" : "text-n-500"}`}>
            How it works
          </h4>
        </Link>
      </div>
      );
    }
  }

  return (
    <div
    className="h-full w-[300px] 
    bg-white rounded-tr-[32px]
    border border-n-300 border-r-[1px] 
    border-t-[1px] px-[32px]"
    >
     {sidebarContent()}
    </div>
  );
};

export default Sidebar;

