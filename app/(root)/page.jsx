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
import Image from "next/image";
import { boltWhite, cancelWhite } from "@/public/icons/white";
import Button from "@/components/Button";


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
  const [machinePopoverOpen, setMachinePopoverOpen] = useState(false);
  const [comfirmationPopoverState, setComfirmationPopoverState] = useState("");
  const [selectedPartialId, setSelectedPartialId] = useState("");
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("");
  const [userCustomTemplateId, setUserCustomTemplateId] = useState("")
  const [partialTPs, setPartialTPs] = useState([""]);
  const [subIsWrapped, setSubIsWrapped] = useState(false);
  
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
    const machine = () => {
      if (subIsWrapped && machinePopoverOpen || !subIsWrapped && !machinePopoverOpen) {
        return (
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
        )
      } 
    }
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
        <ScrollAreaFrame
        mainClass={`w-full h-[560px]`} 
        innerClass="w-full h-fit flex items-center justify-between flex-wrap"
        setSubIsWrapped={setSubIsWrapped}
        >
          <CardFrame staticTitle={"Partials"}>
            <ScrollAreaFrame
            cardFrame
            vertical
            >
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
          <div className={`${machinePopoverOpen 
          ? "absolute w-full h-full flex justify-center items-center backdrop-blur-lg z-20" 
          : ""}`}
          >
            <div className={`w-fit h-fit flex flex-col items-center justify-center gap-8`}>
              {machine()}    
                {subIsWrapped 
                  ? machinePopoverOpen 
                  ? <div className='w-[48px] h-[48px] 
                  bg-n-900 cursor-pointer rounded-full
                  flex justify-center items-center'
                  onClick={() => setMachinePopoverOpen(false)}>
                    <Image
                      src={cancelWhite}
                      width={24}
                      height={24}
                      alt='cancel icon'
                      priority
                    />
                  </div>      
                  : <div className="w-[245px] absolute bottom-0"
                    onClick={() => setMachinePopoverOpen(true)}>
                    <Button 
                      label={"Machine"}
                      rightIcon
                      rightIconImgSrc={boltWhite}
                      blackButton
                    />
                  </div> 
                : null}
            </div>
          </div>
        </ScrollAreaFrame>
      </div>
    )    
  }
}