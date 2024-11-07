"use client";

import React, { useEffect, useState } from 'react';
import TwoSwitch from './TwoSwitch';

const ChartCardFrame = ({
  children, twoSwitch, 
  smallFrame, chartState, setChartState,
  selectedPartialIndex, partials
}) => {
  const [selectedPartial, setSelectedPartial] = useState();

  useEffect(() => {
    console.log(partials);
    const partial = partials.find((partial, idx) => selectedPartialIndex === idx );

    if (partial) {
      setSelectedPartial(partial);
    }
    
  }, [selectedPartial, selectedPartialIndex, partials]);  
 
  return (
    <div className={`w-[438px] h-[336px]
    bg-white rounded-[32px] shadow-lg relative
    border-2 border-n-300`}>
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 px-[32px] py-[16px]">
        <div className='flex justify-between items-center w-full'>
          <div className='flex justify-between items-start w-full h-[44px]'>
            <TwoSwitch setChartState={setChartState} />
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
            <TwoSwitch setChartState={setChartState} /> 
          </div>
        </div>          
        <div className="w-full h-full">
          {children}          
        </div>
      </div>
    </div>
  )
}

export default ChartCardFrame