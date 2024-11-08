"use client";

import { useEffect, useState } from "react";
import Pill from "./Pill";
import partialCalc from "@/common/partialCalc";
import { curveLine } from "@/public/icons";
import Image from "next/image";
import { clipboardWhite } from "@/public/icons/white";
import FormFrame from "./FormFrame";
import DualButton from "./DualButton";
import { useSession } from "next-auth/react";
import { cancelBlack } from "@/public/icons/black";
import deleteCustomTemplate from "@/actions/deleteCustomTemplete";

const ChartFrameInnerContainer = ({chartState, partials, selectedPartialIndex}) => {
  const [selectedPartialTPs, setSelectedPartialTPs] = useState([]);
  const [selectedPartialTPIndex, setSelectedPartialTPIndex] = useState(0)
  const [customTemplate, setCustomTemplate] = useState("");
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const [userCustomTemplate, setUserCustomTemplate] = useState("");

  // useEffect(() => {
  //   const partial = partials.find((partial, idx) => selectedPartialIndex === idx );

  //   if (partial) {
  //     const partialTPs = partialCalc(partial?.lotSize, partial?.finalTP, partial?.partialTPs);  

  //     setSelectedPartialTPs(partialTPs)
  //   }
  // }, [partials, selectedPartialIndex]); 
  
  useEffect(() => {
    if (status === "authenticated") {
      const partial = partials.find((partial, idx) => selectedPartialIndex === idx );

      if (partial) {
        const partialTPs = partialCalc(partial?.lotSize, partial?.finalTP, partial?.partialTPs);  
        setSelectedPartialTPs(partialTPs)
      }
      const fetchUserCustomTemplate = async () => {
        const res = await fetch(`http://localhost:3000/api/getCustomTemplate?email=${email}`, { cache: "no-store" });
        
        if (!res.ok) return notFound();
        
        const data = await res.json()

        console.log(data);  
        
        setUserCustomTemplate(data);
      };
      fetchUserCustomTemplate();
    }
  }, [partials, selectedPartialIndex]); 

  if (chartState === "Template") {
    return (
      !userCustomTemplate ? 
        <div className="flex flex-col justify-start items-center w-full h-full">
          <FormFrame
            chartState={chartState}
            customTemplate={customTemplate}
            setCustomTemplate={setCustomTemplate}
          >
            <DualButton 
              leftLabel={"Cancel"}
              rightlabel={"Save"}
              valueReset={setCustomTemplate}
            />
          </FormFrame>
        </div>
        
      : <div className="flex h-full w-full items-center justify-center">
          <Pill 
            partialTP={userCustomTemplate.customValue + "%"}
            leftIconImgSrc={cancelBlack}
            active
            action={deleteCustomTemplate}
            email={email}
            userCustomTemplateId={userCustomTemplate._id}
          />
        </div>
    )
  }

  if (chartState === "Chart") {
    const partialTP = selectedPartialTPs.find((partialTP, idx) => selectedPartialTPIndex === idx );
    return (
      <div className="flex flex-col items-center justify-between w-full h-full">
        {selectedPartialTPs.length > 0 ? 
          <div className="relative mt-[16px]">
            <div className='w-[290px] h-[160px]'>
              <Image
                src={curveLine}
                width={290}
                height={160}
                alt='curve-line icon'
                priority
              />
            </div>
            <div className="absolute top-0 right-0">
              <Pill
                partialTP={`TP${selectedPartialTPIndex + 1}: ${partialTP}`}
                leftIconImgSrc={clipboardWhite}
                blackPill
              />
            </div>
          </div>
        :null}
        {selectedPartialTPs.length > 0 ? 
          <div className="flex w-[261px] 
          h-fit gap-2 p-4 rounded-[16px] 
          border border-n-300 shadow-lg">
            {selectedPartialTPs?.map((partialTP, idx) => {
              return (
                <div key={idx}
                  onClick={() => setSelectedPartialTPIndex(idx)}
                >
                  <Pill 
                    partialTP={`TP${idx + 1}: ${partialTP}`}
                    active={selectedPartialTPIndex === idx ? true : false}
                  />              
                </div>
              )
            })}
          </div>
        : null}
      </div>
    )
  }
}

export default ChartFrameInnerContainer