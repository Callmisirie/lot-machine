"use client";

import { useEffect, useState } from "react";
import Pill from "./Pill";
import partialCalc from "@/common/partialCalc";
import { curveLine } from "@/public/icons";
import Image from "next/image";
import { clipboardWhite } from "@/public/icons/white";
import FormFrame from "./FormFrame";
import DualButton from "./DualButton";
import { cancelBlack } from "@/public/icons/black";
import deleteCustomTemplate from "@/actions/deleteCustomTemplete";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { ScrollAreaFrame } from "./ScrollArea";
import { ScrollBar } from "./ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchUserCustomTemplate = async (email) => {
  const res = await fetch(`/api/getCustomTemplate?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user custom template");
  return res.json();
};

const ChartFrameInnerContainer = ({
  chartState, partials, 
  selectedPartialIndex, serverUpdate, 
  setServerUpdate, templateState,
  setTemplateState, selectedPartialTPIndex, 
  setSelectedPartialTPIndex, setComfirmationPopoverOpen,
  setComfirmationPopoverState, setUserCustomTemplateId
}) => {
  const [selectedPartialTPs, setSelectedPartialTPs] = useState([]);
  const [customTemplate, setCustomTemplate] = useState("");
  const {isAuthenticated, user} = useKindeBrowserClient();

  const {
    data: userCustomTemplate,
    isLoading: userCustomTemplateLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userCustomTemplate", user?.email],
    queryFn: () => fetchUserCustomTemplate(user.email),
    enabled: isAuthenticated && user?.email !== undefined, // Only fetch when authenticated
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  }); 

  useEffect(() => {
    if (isAuthenticated) {
      const partial = partials.find((partial, idx) => selectedPartialIndex === idx );

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
  }, [isAuthenticated, partials, selectedPartialIndex, serverUpdate, templateState, userCustomTemplateLoading]); 


  if (chartState === "Template") {
    return (
      !userCustomTemplate ? 
        <div className="flex flex-col justify-start items-center w-full h-full">
          <FormFrame
            chartState={chartState}
            customTemplate={customTemplate}
            setCustomTemplate={setCustomTemplate}
            serverUpdate={serverUpdate}
            setServerUpdate={setServerUpdate}
          >
            <DualButton 
              leftLabel={"Cancel"}
              rightlabel={"Save"}
              valueReset={setCustomTemplate}
            />
          </FormFrame>
        </div>
        
      : <div className="flex h-full w-full items-center justify-center relative bottom-[28px]">
          <Pill 
            content={userCustomTemplate.customValue + "%"}
            rightIconImgSrc={cancelBlack}
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