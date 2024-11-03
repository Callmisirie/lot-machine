import React from 'react'
import TwoSwitch from './TwoSwitch';

const ChartCardFrame = ({
  children, twoSwitch, 
  smallFrame, chartState, setChartState
}) => {
 
  return (
    <div className={`w-[438px] h-[336px]
    bg-white rounded-[32px] shadow-lg relative`}>
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 px-[32px]">
        <div className='flex justify-between items-center w-full mt-[32px]'>
          <div className='flex justify-between items-center w-full'>
            <TwoSwitch setChartState={setChartState} />
            <div className="flex flex-col items-center">
              <h4 className='h5'>
                GBPUSD
              </h4>
              <p className='p2r'>
                Lohymn
              </p>
            </div>
            <TwoSwitch setChartState={setChartState} /> 
          </div>
        </div>          
        <div className="">
          {children}          
        </div>
      </div>
    </div>
  )
}

export default ChartCardFrame