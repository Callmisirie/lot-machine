"use client";

import { useEffect, useState } from "react";
import Pill from "./Pill";
import partialCalc from "@/common/partialCalc";
import { curveLine } from "@/public/icons";
import Image from "next/image";
import { clipboardWhite } from "@/public/icons/white";
import FormFrame from "./FormFrame";
import DualButton from "./DualButton";
import { cancelBlack, deleteIconBlack } from "@/public/icons/black";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ScrollAreaFrame } from "./ScrollArea";
import { ScrollBar } from "./ui/scroll-area";
import { cautionAccentGreen, cautionAccentRed } from "@/public/icons/accent";

const ChartFrameInnerContainer = ({
  chartState, partials, 
  selectedPartialIndex, serverUpdate, 
  setServerUpdate, templateState,
  setTemplateState, selectedPartialTPIndex, 
  setSelectedPartialTPIndex, setComfirmationPopoverOpen,
  setComfirmationPopoverState, setUserCustomTemplateId, 
  userCustomTemplate, userInfo
}) => {
  const [selectedPartialTPs, setSelectedPartialTPs] = useState([]);
  const [customTemplate, setCustomTemplate] = useState("");
  const {isAuthenticated, user} = useKindeBrowserClient();
  const [customTemplateMessage, setCustomTemplateMessage] = useState({
    success: false,
    messageContent: ""
  });

  useEffect(() => {
    if (isAuthenticated) {
      const partial = partials?.find((partial, idx) => selectedPartialIndex === idx );

      if (partial) {
        const partialTPs = partialCalc(
          partial?.lotSize, 
          partial?.finalTP, 
          partial?.partialTPs, 
          templateState,
          userCustomTemplate?.customValue
        );  
        
        setSelectedPartialTPs(partialTPs)
      }
    }
  }, [isAuthenticated, partials, selectedPartialIndex, serverUpdate, templateState]); 


  if (chartState === "Template") {
    return (
      !userCustomTemplate ? 
        <div className="flex flex-col justify-between items-center w-full h-full">
          <FormFrame
            chartState={chartState}
            customTemplate={customTemplate}
            setCustomTemplate={setCustomTemplate}
            serverUpdate={serverUpdate}
            setServerUpdate={setServerUpdate}
            setCustomTemplateMessage={setCustomTemplateMessage}
          >
          <div className="flex flex-col 
          justify-center items-center w-full h-fit 
          relative bottom-[-41px] max-md:bottom-[0px]">
            <div className={`flex w-fit 
              min-h-[24px] items-center 
              justify-center mb-1 gap-1
              ${!customTemplateMessage?.messageContent && "invisible"}`}>
              <Image 
                src={customTemplateMessage?.success ? cautionAccentGreen : cautionAccentRed} 
                width={24} 
                height={24} 
                alt="cation icon" 
                className="" 
                priority
                />   
              <p className={`l3r ${customTemplateMessage?.success 
                ? "text-accent-green-300" 
                : "text-accent-red-300"}`}>
                  {customTemplateMessage?.messageContent}
              </p>
            </div>
            <DualButton 
              leftLabel={"Cancel"}
              rightlabel={"Save"}
              valueReset={setCustomTemplate}
            />            
          </div>
          </FormFrame>
        </div>
        
      : <div className="flex h-full w-full items-center justify-center relative bottom-[28px]">
          <Pill 
            content={userCustomTemplate.customValue + "%"}
            rightIconImgSrc={deleteIconBlack}
            active
            action
            email={user?.email}
            userCustomTemplateId={userCustomTemplate._id}
            serverUpdate={serverUpdate}
            setServerUpdate={setServerUpdate}
            setTemplateState={setTemplateState}
            setComfirmationPopoverOpen={setComfirmationPopoverOpen}
            setComfirmationPopoverState={setComfirmationPopoverState}
            setUserCustomTemplateId={setUserCustomTemplateId}
            userInfo={userInfo}
          />
        </div>
    )
  }

  if (chartState === "Chart") {
    const partialTP = selectedPartialTPs?.find((partialTP, idx) => selectedPartialTPIndex === idx );
    return (
      <div className="flex flex-col items-center justify-between w-full h-full">
        {selectedPartialTPs?.length > 0 ? 
          <div className="relative mt-[16px] max-md:mt-[8px]">
            <div className='w-[290px] h-[160px] max-md:w-[234px] max-md:h-[94px]'>
              <Image
                src={curveLine}
                width="auto"
                height="auto"
                alt='curve-line icon'
                priority
              />
            </div>
            <div className="absolute top-0 right-0">
              <Pill
                content={`TP${selectedPartialTPIndex + 1}: ${partialTP}`}
                rightIconImgSrc={clipboardWhite}
                blackPill
                partialTP={partialTP}
                copy
                userInfo={userInfo}
              />
            </div>
          </div>
        :null}
        {selectedPartialTPs?.length > 0 ? 
          <div className="flex w-[261px] 
          h-[56px] px-4 rounded-[16px] 
          justify-center items-center
          border border-n-300 shadow-md 
          no-select">
            <ScrollAreaFrame 
            partialFrame
            horizontal
            >
              {selectedPartialTPs?.map((partialTP, idx) => {
                return (
                  <div key={idx}
                    onClick={() => setSelectedPartialTPIndex(idx)}
                    className=""
                  >
                    <Pill 
                      content={`TP${idx + 1}: ${partialTP}`}
                      active={selectedPartialTPIndex === idx ? true : false}
                    />              
                  </div>
                )
              })}
              <ScrollBar orientation="horizontal" />
            </ScrollAreaFrame>
          </div>
        : null}
      </div>
    )
  }
}

export default ChartFrameInnerContainer