import React from 'react'

const PaymentDurationPill = ({paymentDurationState, setPaymentDurationState}) => {
  return (
    <div className={`flex flex-col 
      items-center justify-center 
      w-fit h-fit gap-2 absolute top-0 right-0
      rounded-[16px] bg-n-100 shadow-md`}>
        <div className={`flex items-center 
        justify-center w-[98px] max-md:w-[92px] 
        h-[32px] rounded-[16px] 
        cursor-pointer ${paymentDurationState === "Month" ? "bg-n-900 text-n-100" : "bg-white text-n-900"}`}
          onClick={() => setPaymentDurationState("Month")}
        >
          <p className='p3b'
          >Monthly</p>
        </div>
        <div className={`flex items-center 
        justify-center w-[98px] max-md:w-[92px] 
        h-[32px] rounded-[16px] 
        cursor-pointer ${paymentDurationState === "Year" ? "bg-n-900 text-n-100" : "bg-white text-n-900"}`}
          onClick={() => setPaymentDurationState("Year")}
        >
          <p className='p3b'
          >Yearly</p>
        </div>
      </div>
  )
}

export default PaymentDurationPill