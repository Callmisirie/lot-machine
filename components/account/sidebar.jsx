"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <div
      className="h-full w-[300px] bg-white rounded-tr-[32px]
    border border-n-300 border-r-[1px] border-t-[1px] px-[32px]"
    >
      <div className="w-full h-fit flex flex-col gap-[58px] py-[32px]">
        <Link href={"/account/profile"}>
          <h4 className={`h4 ${pathname === "/account/profile" ? "text-n-700" : "text-n-500"}`}>
            Profile
          </h4>
        </Link>
        <Link href={"/account/plans"}>
          <h4 className={`h4 ${pathname === "/account/plans" ? "text-n-700" : "text-n-500"}`}>
            Plans
          </h4>
        </Link>
        <Link href={"/account/referral"}>
          <h4 className={`h4 ${pathname === "/account/referral" ? "text-n-700" : "text-n-500"}`}>
            Referral
          </h4>
        </Link>
        <Link href={"/account/how-it-works"}>
          <h4 className={`h4 ${pathname === "/account/how-it-works" ? "text-n-700" : "text-n-500"}`}>
            How it works
          </h4>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
