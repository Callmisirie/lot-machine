import React from 'react'

const TabButtons = ({
  rightlabel,
  leftLabel,
  tabButtonState,
  setTabButtonState,
  referral,
  howItWorks
}) => {
  return (
    <div className="flex px-2 
    py-4 gap-4 w-full 
    justify-center items-center">
      <div
      className={`flex items-center 
      justify-center w-full 
      h-[48px] cursor-pointer
      rounded-[16px] shadow-md 
      ${referral ?
      tabButtonState === "Statistic"
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
          setTabButtonState("Statistic")
        }
        if (howItWorks) {
          setTabButtonState("Lot machine")
        }
      }}>
        <p className='l1b'>
          {leftLabel}
        </p>
      </div>
      <div
      className={`flex items-center 
      justify-center w-full 
      h-[48px] cursor-pointer
      rounded-[16px] shadow-md 
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
        <p className='l1b'>
          {rightlabel}
        </p>
      </div>
    </div>
  )
}

export default TabButtons