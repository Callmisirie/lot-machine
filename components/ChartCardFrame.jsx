"use client";

import React, { useEffect, useState } from 'react';
import TwoSwitch from './TwoSwitch';
import TemplatePill from './TemplatePill';
import { dropArrowBlack } from '@/public/icons/black';
import { dropArrowWhite } from '@/public/icons/white';

const ChartCardFrame = ({
  children, chartState, 
  setChartState, selectedPartialIndex, 
  partials, templateState, 
  setTemplateState, userCustomTemplate
}) => {
  const [selectedPartial, setSelectedPartial] = useState();
  useEffect(() => {
    const partial = partials?.find((partial, idx) => selectedPartialIndex === idx );

    if (partial) {
      setSelectedPartial(partial);
    }
    
  }, [selectedPartial, selectedPartialIndex, partials]);  
 
  return (
    <div className={`w-[438px] h-[336px] 
    max-md:w-[325px] max-md:h-[269px]
    bg-white rounded-[32px] shadow-lg relative
    border-2 border-n-300`}>
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 px-[32px] py-[16px]">
        <div className='flex justify-between items-center w-full'>
          <div className={`flex items-start w-full h-[44px] ${chartState  === "Template" ? "justify-center" : "justify-between"}`}>
            {chartState === "Chart" && (
              <div className='flex justify-start w-[98px] max-md:w-[92px] h-[44px]'>
                <TemplatePill
                  leftIconImgSrc={templateState === "D" ? dropArrowWhite
                  : dropArrowBlack}
                  templateState={templateState}
                  setTemplateState={setTemplateState}
                  userCustomTemplate={userCustomTemplate}
                  />
              </div>
            )}
            {chartState === "Chart" ? 
              <div className="flex flex-col items-center">
                <h4 className='h5 text-n-900'>
                  {selectedPartial?.instrument}
                </h4>
                <p className='p2r text-n-700'>
                  {selectedPartial?.nickname}
                </p>
              </div>
            : chartState === "Template" ? 
              <div className="flex flex-col items-center">
                <h4 className='h4 text-n-900'>
                  Template
                </h4>
                <p className='p3r text-n-500 text-center w-[171px] h-fit'>
                  Customize your template to offload on each partial.
                </p >
              </div>
            :null}
            <div className={`flex justify-end w-[98px] max-md:w-[92px] ${chartState === "Template" && "absolute right-8"}`}>
              <TwoSwitch setChartState={setChartState} />  
            </div>
          </div>
        </div>          
        <div className="w-full h-full flex items-start justify-center">
          {children}          
        </div>
      </div>
    </div>
  )
}

export default ChartCardFrame