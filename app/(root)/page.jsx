"use client";

import paths from "@/common/paths";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import CardFrame from "@/components/CardFrame";
import PartialContainer from "@/components/PartialContainer";
import { clipboardBlack, deleteIconBlack } from "@/public/icons/black";
import ChartCardFrame from "@/components/ChartCardFrame";
import CardFrameInnerContainer from "@/components/CardFrameInnerContainer";
import partialCalc from "@/common/partialCalc";
import ChartFrameInnerContainer from "@/components/ChartFrameInnerContainer";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ScrollAreaFrame } from "@/components/ScrollArea";
import ComfirmationPopoverButton from "@/components/ComfirmationPopoverButton";


export default function Home() {
  const [machineState, setMachineState] = useState("Machine");
  const [chartState, setChartState] = useState("Chart");
  const [partials, setPartials] = useState([]);
  const [selectedPartialIndex, setSelectedPartialIndex] = useState(0);
  const [selectedPartialTPIndex, setSelectedPartialTPIndex] = useState(0);
  const [templateState, setTemplateState] = useState("D");
  const [serverUpdate, setServerUpdate] = useState(true);
  const [selectInstrument, setSelectInstrument] = useState("");
  const [userCustomTemplate, setUserCustomTemplate] = useState("");
  const {isAuthenticated, isLoading, user, idTokenEncoded} = useKindeBrowserClient();
  const [comfirmationPopoverOpen, setComfirmationPopoverOpen] = useState(false);
  const [comfirmationPopoverState, setComfirmationPopoverState] = useState("");
  const [selectedPartialId, setSelectedPartialId] = useState("");
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("");
  const [userCustomTemplateId, setUserCustomTemplateId] = useState("")
  const [partialTPs, setPartialTPs] = useState([""]);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect(paths.auth());
    } else if (isAuthenticated) {
      const lmAt = idTokenEncoded;

      if (!lmAt) {
        redirect(paths.auth());
      }

      const fetchPartials = async () => {
        const res = await fetch(`http://localhost:3000/api/getPartials?email=${user.email}`, { cache: "no-store" });
        
        if (!res.ok) return notFound();
        
        const data = await res.json();
        
        setPartials(data);
      };
      fetchPartials();
    } 
  }, [isLoading, isAuthenticated, serverUpdate]);

  const firstName =  user?.given_name.charAt(0).toUpperCase() + user?.given_name.slice(1).toLowerCase();

  if (isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center relative">
        {comfirmationPopoverOpen && (
          <ComfirmationPopoverButton 
            comfirmationPopoverState={comfirmationPopoverState}
            setComfirmationPopoverOpen={setComfirmationPopoverOpen}
            comfirmationPopoverOpen={comfirmationPopoverOpen}
            serverUpdate={serverUpdate}
            setServerUpdate={setServerUpdate}
            selectedInstrumentId={selectedInstrumentId}
            selectedPartialId={selectedPartialId}
            setPartialTPs={setPartialTPs}
            userCustomTemplateId={userCustomTemplateId}
            setTemplateState={setTemplateState}
          />
        )}
        <div className="w-full h-fit flex items-end justify-between">
          <CardFrame staticTitle={"Partials"}>
            <ScrollAreaFrame
            vertical>
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
                    className="no-select"
                  >
                    <PartialContainer 
                      name={partial.instrument}
                      nickname={partial.nickname}
                      partials={partials}
                      dateNTime={dateNTime}
                      leftIconImgSrc={clipboardBlack}
                      rightIconImgSrc={deleteIconBlack}
                      leftIconContainer
                      active={selectedPartialIndex === idx ? true : false}
                      setComfirmationPopoverOpen={setComfirmationPopoverOpen}
                      copy
                    >
                      <div onClick={() => {
                        setSelectedPartialIndex(idx);
                        setSelectedPartialId(partial._id)
                        setComfirmationPopoverState("Partials")
                        if (selectedPartialIndex !== idx) {
                          setSelectedPartialTPIndex(0);
                        }                     
                      }}
                      className="absolute top-0 w-full h-full z-10"/>
                    </PartialContainer>
                  </div>
                );      
              })}
            </ScrollAreaFrame>
          </CardFrame>
          <div className="flex flex-col items-center gap-10">
            <div className="h-[72px]">
              {user?.given_name && (
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
                selectedPartialTPIndex={selectedPartialTPIndex}
                setSelectedPartialTPIndex={setSelectedPartialTPIndex}
                setComfirmationPopoverState={setComfirmationPopoverState}
                setComfirmationPopoverOpen={setComfirmationPopoverOpen}
                setUserCustomTemplateId={setUserCustomTemplateId}
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
              setSelectedInstrumentId={setSelectedInstrumentId}
              setComfirmationPopoverState={setComfirmationPopoverState}
              setComfirmationPopoverOpen={setComfirmationPopoverOpen}
              partialTPs={partialTPs}
              setPartialTPs={setPartialTPs}
            />
          </CardFrame>        
        </div>
      </div>
    )    
  }
}