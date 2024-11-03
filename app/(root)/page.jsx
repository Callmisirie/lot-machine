"use client";

import paths from "@/common/paths";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { connectMongoDB } from "@/lib/mongodb";
import CardFrame from "@/components/CardFrame";
import PartialContainer from "@/components/PartialContainer";
import { clipboardBlack, deleteIconBlack } from "@/public/icons/black";
import ChartCardFrame from "@/components/ChartCardFrame";
import CardFrameInnerContainer from "@/components/CardFrameInnerContainer";

export default function Home() {
//  connectMongoDB();

  const { data: session, status } = useSession();
  const [machineState, setMachineState] = useState("Machine");
  const [chartState, setChartState] = useState("Chart");
  
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

  const firstName = session?.user?.name.split(' ')[0]?.charAt(0)
  .toUpperCase() + session?.user?.name.split(' ')[0]?.slice(1).toLowerCase();

  return (
    <div className="w-full h-screen flex items-center">
      <div className="w-full h-fit flex items-start justify-between">
      <CardFrame 
        staticTitle={"Partials"}
        >
          <div className="flex flex-col gap-2">
            <PartialContainer 
              name={"name"}
              nickname={"nickname"}
              partials={"partials"}
              dateNTime={"dateNTime"}
              leftIconImgSrc={clipboardBlack}
              rightIconImgSrc={deleteIconBlack}
              leftIconContainer
              active
            />    
            <PartialContainer 
              name={"name"}
              nickname={"nickname"}
              partials={"partials"}
              dateNTime={"dateNTime"}
              leftIconImgSrc={clipboardBlack}
              rightIconImgSrc={deleteIconBlack}
              leftIconContainer
              active
            />                     
          </div>
      </CardFrame>
      <div className="flex flex-col items-center gap-10">
        <div className="h-[72px]">
          {session?.user?.name && (
            <h2 className="h2 text-n-900">Hi, {firstName}!</h2>           
          )}          
        </div>
        <ChartCardFrame
          chartState={chartState}
          setChartState={setChartState}
          >

        </ChartCardFrame>          
      </div>
     
      <CardFrame 
        threeSwitch
        machineState={machineState}
        setMachineState={setMachineState}
        >
          <CardFrameInnerContainer
            machineState={machineState} 
          />
      </CardFrame>        
      </div>
    </div>
  );
}