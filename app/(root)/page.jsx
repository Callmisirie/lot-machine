"use client";

import paths from "@/common/paths";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import checkUserAuth from "@/actions/checkUserAuth";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect(paths.auth());
    } else if (status === "authenticated" ) {
      if (!checkUserAuth(session?.user?.email))
      redirect(paths.auth());
    } 
  }, [status]);

  return (
    <div className="w-full h-screen">
    </div>
  );
}