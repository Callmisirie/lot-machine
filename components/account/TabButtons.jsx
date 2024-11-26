import React from 'react'

const TabButtons = ({
  bottomLabel,
  topLabel,
  tabButtonState,
  setTabButtonState,
  referral,
  howItWorks
}) => {
  return (
    <div className={`flex flex-col 
    items-center justify-center 
    w-fit h-fit gap-2 absolute top-[32px] right-[32px]
    rounded-[16px] bg-n-100 shadow-md`}>
      <div
      className={`flex items-center 
      justify-center w-[98px] max-md:w-[92px] 
      h-[32px] rounded-[16px] 
      cursor-pointer 
      ${referral ?
      tabButtonState === "Statistics"
      ? "bg-n-900 text-n-100"
      : "bg-white text-n-900"
      : ""}
      ${howItWorks ?
      tabButtonState === "Lot machine"
      ? "bg-n-900 text-n-100"
      : "bg-white text-n-900"
      : ""}`}
      onClick={() => {
        if (referral) {
          setTabButtonState("Statistics")
        }
        if (howItWorks) {
          setTabButtonState("Lot machine")
        }
      }}>
        <p className='p3b'>
          {topLabel}
        </p>
      </div>
      <div
      className={`flex items-center 
        justify-center w-[98px] max-md:w-[92px] 
        h-[32px] rounded-[16px] 
        cursor-pointer 
      ${referral ?
        tabButtonState === "Withdrawal"
      ? "bg-n-900 text-n-100"
      : "bg-white text-n-900"
      : ""}
      ${howItWorks ?
         tabButtonState === "Referral"
      ? "bg-n-900 text-n-100"
      : "bg-white text-n-900"
      : ""}`}
      onClick={() => {
        if (referral) {
          setTabButtonState("Withdrawal")
        }
        if (howItWorks) {
          setTabButtonState("Referral")
        }
      }}>
        <p className='p3b'>
          {bottomLabel}
        </p>
      </div>
    </div>
  )
}

export default TabButtons