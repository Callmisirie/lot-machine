"use client";

import paths from "@/common/paths";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import CardFrame from "@/components/CardFrame";
import PartialContainer from "@/components/PartialContainer";
import { clipboardBlack, deleteIconBlack } from "@/public/icons/black";
import ChartCardFrame from "@/components/ChartCardFrame";
import CardFrameInnerContainer from "@/components/CardFrameInnerContainer";
import partialCalc from "@/common/partialCalc";
import ChartFrameInnerContainer from "@/components/ChartFrameInnerContainer";

export default function Home() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const [machineState, setMachineState] = useState("Machine");
  const [chartState, setChartState] = useState("Chart");
  const [partials, setPartials] = useState([]);
  const [selectedPartialIndex, setSelectedPartialIndex] = useState(0)
  const [templateState, setTemplateState] = useState("D");
  const [serverUpdate, setServerUpdate] = useState(true);
  const [selectInstrument, setSelectInstrument] = useState("");
  const [userCustomTemplate, setUserCustomTemplate] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect(paths.auth());
    } else if (status === "authenticated" ) {
      const lmAt = session.access_token;

      if (!lmAt) {
        redirect(paths.auth());
      }

      const fetchPartials = async () => {
        const res = await fetch(`http://localhost:3000/api/getPartials?email=${email}`, { cache: "no-store" });
        
        if (!res.ok) return notFound();
        
        const data = await res.json();
        
        setPartials(data);
      };
      fetchPartials();
    } 
  }, [status, session, serverUpdate]);

  const firstName = session?.user?.name.split(' ')[0]?.charAt(0)
    .toUpperCase() + session?.user?.name.split(' ')[0]?.slice(1).toLowerCase();

  return (
    <div className="w-full h-screen flex items-center">
      <div className="w-full h-fit flex items-start justify-between">
        <CardFrame staticTitle={"Partials"}>
          <div className="flex flex-col gap-2">
            {partials.map((partial, idx) => {
              const partials = partialCalc(
                partial.lotSize, partial.finalTP, 
                partial.partialTPs, templateState, 
                userCustomTemplate?.customValue
              )
              const dateNTime = new Date(partial.createdAt).toLocaleDateString("en-US", {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                // hour: '2-digit', 
                // minute: '2-digit'
              });
              return (
                <div key={idx}
                  onClick={() => setSelectedPartialIndex(idx)}
                >
                  <PartialContainer 
                    name={partial.instrument}
                    nickname={partial.nickname}
                    partials={
                      partials?.map((tp, index) => `TP${index + 1}: ${tp}`)
                        .join(", ")
                        .slice(0, 20) + (partials?.join(", ").length > 9 ? "..." : "")
                    }
                    dateNTime={dateNTime}
                    leftIconImgSrc={clipboardBlack}
                    rightIconImgSrc={deleteIconBlack}
                    leftIconContainer
                    active={selectedPartialIndex === idx ? true : false}
                    partialId={partial._id}
                    email={email}
                    partialSideDelete
                    partialIdx={idx}
                    serverUpdate={serverUpdate}
                    setServerUpdate={setServerUpdate}
                  />
                </div>
              );      
            })}
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
            selectedPartialIndex={selectedPartialIndex}
            partials={partials}
            templateState={templateState}
            setTemplateState={setTemplateState}
            userCustomTemplate={userCustomTemplate}
          >
            <ChartFrameInnerContainer 
              chartState={chartState}
              selectedPartialIndex={selectedPartialIndex}
              partials={partials}
              serverUpdate={serverUpdate}
              setServerUpdate={setServerUpdate}
              setUserCustomTemplate={setUserCustomTemplate}
              userCustomTemplate={userCustomTemplate}
              templateState={templateState}
              setTemplateState={setTemplateState}
            />

          </ChartCardFrame>
        </div>
     
        <CardFrame 
          threeSwitch
          machineState={machineState}
          setMachineState={setMachineState}
        >
          <CardFrameInnerContainer 
            machineState={machineState} 
            serverUpdate={serverUpdate}
            setServerUpdate={setServerUpdate}
            selectInstrument={selectInstrument}
            setSelectInstrument={setSelectInstrument}
          />
        </CardFrame>        
      </div>
    </div>
  );
}
