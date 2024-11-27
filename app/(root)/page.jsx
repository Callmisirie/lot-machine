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
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import useResizeObserver from "use-resize-observer";

const fetchPartials = async (email) => {
  const res = await fetch(`/api/getPartials?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch partials");
  return res.json();
};

const fetchUserCustomTemplate = async (email) => {
  const res = await fetch(`/api/getCustomTemplate?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user custom template");
  return res.json();
};

export default function Home() {
  const [machineState, setMachineState] = useState("Machine");
  const [chartState, setChartState] = useState("Chart");
  const [selectedPartialIndex, setSelectedPartialIndex] = useState(0);
  const [selectedPartialTPIndex, setSelectedPartialTPIndex] = useState(0);
  const [templateState, setTemplateState] = useState("D");
  const [serverUpdate, setServerUpdate] = useState(true);
  const [selectInstrument, setSelectInstrument] = useState("");
  const {isAuthenticated, isLoading, user} = useKindeBrowserClient();
  const [comfirmationPopoverOpen, setComfirmationPopoverOpen] = useState(false);
  const [machinePopoverOpen, setMachinePopoverOpen] = useState(false);
  const [comfirmationPopoverState, setComfirmationPopoverState] = useState("");
  const [selectedPartialId, setSelectedPartialId] = useState("");
  const [deleteSelectedPartialId, setDeleteSelectedPartialId] = useState("");
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("");
  const [userCustomTemplateId, setUserCustomTemplateId] = useState("")
  const [partialTPs, setPartialTPs] = useState([""]);
  const [subIsWrapped, setSubIsWrapped] = useState(false);
  const [message, setMessage] = useState({
    success: false,
    messageContent: ""
  });
  const { ref, height } = useResizeObserver();  
  const {
    data: partials,
    isLoading: partialsLoading,
  } = useQuery({
    queryKey: ["partials", user?.email],
    queryFn: async () => await fetchPartials(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  const {
    data: userCustomTemplate,
    isLoading: userCustomTemplateLoading,
  } = useQuery({
    queryKey: ["userCustomTemplate", user?.email],
    queryFn: async () => await fetchUserCustomTemplate(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  }); 

  const firstName =  user?.given_name.charAt(0).toUpperCase() + user?.given_name.slice(1).toLowerCase();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const referral = queryParams.get("referral");
    if (referral) {
      localStorage.setItem("referralId", referral);
    }
  }, []);

  if (isLoading || partialsLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center relative">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-10 h-10 animate-spin text-primary" />
          <h3 className="text-xl font-bold">Loading...</h3>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !isAuthenticated) {
    redirect(paths.auth());
  }

  if (isAuthenticated && !partialsLoading && partials) {
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
              message={message}
              setMessage={setMessage}
            />
          </CardFrame>
        )
      } 
    }
    
    return (
      <div className="w-full h-full flex items-start relative">
        <div ref={ref}className="w-full h-full absolute" />
        {comfirmationPopoverOpen && (
          <ComfirmationPopoverButton 
            comfirmationPopoverState={comfirmationPopoverState}
            setComfirmationPopoverOpen={setComfirmationPopoverOpen}
            comfirmationPopoverOpen={comfirmationPopoverOpen}
            serverUpdate={serverUpdate}
            setServerUpdate={setServerUpdate}
            selectedInstrumentId={selectedInstrumentId}
            selectedPartialId={selectedPartialId}
            setSelectedPartialId={setSelectedPartialId}
            deleteSelectedPartialId={deleteSelectedPartialId}
            setPartialTPs={setPartialTPs}
            userCustomTemplateId={userCustomTemplateId}
            setTemplateState={setTemplateState}
            setSelectedPartialIndex={setSelectedPartialIndex}
            selectedPartialIndex={selectedPartialIndex}
            partials={partials}
            setSelectedPartialTPIndex={setSelectedPartialTPIndex}
          />
        )}
          <div
            style={{ 
              height: `${subIsWrapped ? `${height - 48}px` : '100%'}` 
            }} // Dynamically set the inline style
            className="w-full flex items-center justify-center absolute"
          >
          <ScrollAreaFrame
            // mainClass={`w-full absolute h-[560px]`} 
            mainClass={`w-full h-full`} 
            innerClass="w-full h-full flex items-center justify-between flex-wrap gap-8 max-md:gap-4"
            setSubIsWrapped={setSubIsWrapped}
            setMachinePopoverOpen={setMachinePopoverOpen}
            >
              <CardFrame staticTitle={"Partials"}>
                <ScrollAreaFrame
                cardFrame
                vertical
                >
                  {partials?.map((partial, idx) => {
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
                          setDeleteSelectedPartialId={setDeleteSelectedPartialId}
                          setComfirmationPopoverState={setComfirmationPopoverState}
                          partialId={partial._id}
                        >
                          <div onClick={() => {
                            setSelectedPartialIndex(idx);
                            setSelectedPartialId(partial._id);
                            setDeleteSelectedPartialId("");
                            setComfirmationPopoverState("Partials");
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
              <div className="flex flex-col items-center gap-10 max-md:gap-4">
                <div className="h-[72px]">
                  {user?.given_name && (
                    <h2 className="h2r2 text-n-900">Hi, {firstName}!</h2>           
                  )}          
                </div>
                <ChartCardFrame
                  chartState={chartState}
                  setChartState={setChartState}
                  selectedPartialIndex={selectedPartialIndex}
                  partials={partials}
                  templateState={templateState}
                  setTemplateState={setTemplateState}
                  machineState={machineState}
                  userCustomTemplate={userCustomTemplate}
                >
                  <ChartFrameInnerContainer 
                    chartState={chartState}
                    selectedPartialIndex={selectedPartialIndex}
                    partials={partials}
                    serverUpdate={serverUpdate}
                    setServerUpdate={setServerUpdate}
                    templateState={templateState}
                    setTemplateState={setTemplateState}
                    selectedPartialTPIndex={selectedPartialTPIndex}
                    setSelectedPartialTPIndex={setSelectedPartialTPIndex}
                    setComfirmationPopoverState={setComfirmationPopoverState}
                    setComfirmationPopoverOpen={setComfirmationPopoverOpen}
                    setUserCustomTemplateId={setUserCustomTemplateId}
                    userCustomTemplate={userCustomTemplate}
                  />
                </ChartCardFrame>
              </div>
              <div className={`${machinePopoverOpen 
              ? "fixed w-full flex justify-center items-center backdrop-blur-lg z-20" 
              : ""}`}
              style={{ 
                height: `${subIsWrapped && machinePopoverOpen ? `${height}px` : 'fit-content'}`}}
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
                      : <div className="w-[245px] absolute bottom-0 z-30"
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

      </div>
    )    
  }
}
