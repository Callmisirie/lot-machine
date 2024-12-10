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
        flex md:flex-col gap-[58px] py-[32px] 
         max-md:py-4 max-md:h-fit
        transition-all duration-300`}>
          {Array.from({length: 4}).map((_, index) => (
            <Skeleton key={index}
            className="w-full h-[36px] rounded-[8px] 
            max-md:h-[24px] max-md:rounded-[4px] bg-n-300/25" />
          ))}
      </div>
      );
    } 

    if (userInfo ) {
      return (
        <div className={`w-full h-fit 
        flex md:flex-col md:gap-[58px] py-[32px] 
        max-md:py-4 max-md:h-fit max-md:justify-between
        transition-all duration-300`}>
          <Link href={"/account/profile"}>
            <h4 className={`h4r2 ${pathname === "/account/profile" ? "text-n-700" : "text-n-500"}`}>
              Profile
            </h4>
          </Link>
          {userInfo.plan !== "Master" && (
            <Link href={"/account/plans"}>
              <h4 className={`h4r2 ${pathname === "/account/plans" ? "text-n-700" : "text-n-500"}`}>
                Plans
              </h4>
            </Link>
          )}
          <Link href={`/account/overview/${userInfo.plan === "Master" ? "manager" : "referral"}`}>
            <h4 className={`h4r2 ${pathname === `/account/overview/${userInfo.plan === "Master" ? "manager" : "referral"}` ? "text-n-700" : "text-n-500"}`}>
              {userInfo.plan === "Master" ? "Manager" : "Referral"}
            </h4>
          </Link>
          <Link href={"/account/how-it-works"}>
            <h4 className={`h4r2 ${pathname === "/account/how-it-works" ? "text-n-700" : "text-n-500"}`}>
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
    max-md:h-fit max-md:w-full
    bg-white md:rounded-tr-[32px]
    border-n-300 md:border-r-[1px] 
    max-md:border-b-[1px]
    md:border-t-[1px] px-[32px] 
    transition-all duration-300"
    >
     {sidebarContent()}
    </div>
  );
};

export default Sidebar;

