"use client";

import { connectMongoDB } from "@/lib/mongodb";

import paths from "@/common/paths";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import checkUserAuth from "@/actions/checkUserAuth";

export default function Home() {
  // connectMongoDB();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" || !checkUserAuth(session?.user?.email)) {
      redirect(paths.auth());
    }
  }, [status]);

  return (
    <div className="w-full h-screen">
    </div>
  );
}