import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "./ui/button"

export function TooltipFrame({children, label}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <div className="py-2 px-4 h-fit w-fit 
          shadow-sm rounded-[8px] l3r border border-n-300 
          text-n-700 bg-white">
            {label}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
