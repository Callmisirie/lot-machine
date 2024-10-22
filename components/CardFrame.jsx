import React, { useState } from 'react'
import Button from './Button'
import ThreeSwitch from './ThreeSwitch'
import TwoSwitch from './TwoSwitch';

const CardFrame = ({
  children, button, buttonLabel, 
  threeSwitch, twoSwitch, staticTitle, 
  chartType, smallFrame, machineState, setMachineState
}) => {
 
  return (
    <div className={`${chartType ? "w-[438px] h-[336px]" : "w-[303px] h-[608px]"} 
    bg-white rounded-[32px] shadow-lg relative`}>
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 px-[32px]">
        <div className='flex justify-between items-center w-full mt-[32px]'>
          {threeSwitch && (<ThreeSwitch setMachineState={setMachineState} />)}
          {chartType && 
            <div className='flex justify-between items-center w-full'>
              <TwoSwitch />
              <div className="flex flex-col items-center">
                <h4 className='h5'>
                  {staticTitle ? staticTitle : machineState}
                </h4>
                <p className='p2r'>
                  {staticTitle ? staticTitle : machineState}
                </p>
              </div>
              <TwoSwitch /> 
            </div>
          }
        </div>
        {!chartType && (
          <h4 className='h4 absolute top-[64px]'>
            {staticTitle ? staticTitle : machineState}
          </h4>          
        )}
        <div className="">
          {children}          
        </div>
      </div>
    </div>
  )
}

export default CardFrame