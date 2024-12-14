import React from 'react';
import ThreeSwitch from './ThreeSwitch';

const CardFrame = ({
  children, threeSwitch, 
  staticTitle, machineState, setMachineState, 
}) => {
 
  return (
    <div className={`w-[300px] h-[420px] overflow-hidden 
    bg-white rounded-[32px] shadow-lg relative`}>
      <div className="w-full h-full 
      flex flex-col rounded-[32px]
      items-center bg-custom-opacity-25 px-[32px]">
        <div className="h-full w-full flex flex-col items-center gap-1">
          <div className='flex justify-between items-center h-[33px] w-full mt-4'>
            {threeSwitch && (<ThreeSwitch setMachineState={setMachineState} />)}
          </div>
            <h4 className='h4 pt-[8px]'>
              {staticTitle ? staticTitle : machineState}
            </h4>          
          <div className="relative flex flex-col items-center w-full h-full">
            {children}          
          </div>          
        </div>
      </div>
    </div>
  )
}

export default CardFrame;