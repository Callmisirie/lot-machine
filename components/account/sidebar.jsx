"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const fetchUserInfo = async (email) => {
  const res = await fetch(`/api/getUserInfo?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
};

const Sidebar = () => {
  const {isAuthenticated, user} = useKindeBrowserClient();
  const pathname = usePathname(); // Get the current pathname
  const {
    data: userInfo,
    isLoading: userInfoLoading,
  } = useQuery({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => await fetchUserInfo(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  const sidebarContent = () => {
    if (userInfoLoading || !userInfo) {
      return (
        <div className="w-full h-full flex justify-center items-center relative">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-10 h-10 animate-spin text-primary" />
            <h3 className="text-xl font-bold">Loading...</h3>
          </div>
        </div>
      );
    } 

    if (!userInfoLoading && userInfo ) {
      return (
        <div className="w-full h-fit flex flex-col gap-[58px] py-[32px]">
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
      className="h-full w-[300px] bg-white rounded-tr-[32px]
    border border-n-300 border-r-[1px] border-t-[1px] px-[32px]"
    >
     {sidebarContent()}
    </div>
  );
};

export default Sidebar;

