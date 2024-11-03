import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { caution } from "@/public/icons"
import Image from "next/image"

const FormInput = ({name, label, form, description, optional}) => {
  return (
    <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="flex justify-between items-center">
          <FormLabel className="text-n-500 l2r">{label}{optional && (
           <span className="l3r text-n-300">(optional)</span> 
          )}</FormLabel> 
          {description && (
            <div className="flex items-center">
              <Image 
                src={caution} 
                width={24} 
                height={24} 
                alt="caution" 
                className="ml-2"
                priority
                />            
              <FormDescription  className="text-n-300 l3r">
                {description}
              </FormDescription>
            </div>         
          )}
        </div>
        <FormControl>
          <Input {...field} className="h-[32px] w-[184px]"/>
        </FormControl>
      </FormItem>
    )}/>
  )
}

export default FormInput