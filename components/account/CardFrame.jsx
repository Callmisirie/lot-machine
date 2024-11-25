"use client";

const CardFrame = ({children, wide}) => {
  return (
    <div className={`${wide ? "w-[325px]" : "w-[300px]"} h-[420px]
    bg-white rounded-[32px] relative
    border-2 border-n-300`}>
      <div className="w-full h-full flex flex-col
      items-center bg-custom-opacity-25 p-[32px]">
        {children}          
      </div>
    </div>
  )
}

export default CardFrame