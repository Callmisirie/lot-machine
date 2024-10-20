"use client";

import paths from "@/common/paths";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { connectMongoDB } from "@/lib/mongodb";
import CardFrame from "@/components/CardFrame";

export default function Home() {
//  connectMongoDB();

  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect(paths.auth());
    } else if (status === "authenticated" ) {
      const lmAt = session.access_token;

      if (!lmAt) {
        redirect(paths.auth());
      }
    } 
  }, [status, session]);

  return (
    <div className="w-full h-screen flex items-center">
      <CardFrame 
        button
        buttonLabel={"Calculate"}
        title={"Machine"}
      >

      </CardFrame>
    </div>
  );
}