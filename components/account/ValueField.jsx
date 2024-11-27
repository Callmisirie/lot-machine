import { clipboardBlack } from "@/public/icons/black";
import Image from "next/image";

const ValueField = ({ 
  label, 
  value,
  copy
}) => {
  const splitValue = () => {
    let split = value
    if (split.length > 16) {  
      split = split.slice(0, 16)
      split = split + "..."
      return split
    }
    return split
  }
  return (
    <div className="flex flex-col w-fit">
      <div className="flex w-full justify-start">
          <label className="l2r text-n-500">
            {label}
          </label>
      </div>
      <div
      className={`flex ${copy ? "justify-between" : "justify-center"}
      w-[184px] items-center border border-n-500 px-2
      bg-transparent rounded-[8px] h-[32px] select-none`}>
        {copy && (
          <div className="w-[24px] h-[24px]"/>
        )}
        <p className="l2r text-n-500">
          {splitValue()}
        </p>
        {copy && (
          <div className="cursor-pointer"
          onClick={() => {
            if (copy) {
              navigator.clipboard.writeText(value)
            }
          }}>
            <Image 
              src={clipboardBlack} 
              width={24} 
              height={24} 
              alt="copy icon" 
              className="" 
              priority
              /> 
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueField;