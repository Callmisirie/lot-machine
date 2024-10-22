"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
} from "@/components/ui/form"
import FormInput from "./FormInput"
import addInstrument from "@/actions/addInstrument"
import { useSession } from "next-auth/react"

const FormSchema = z.object({
  instrument: z.string().min(2, {
    message: "Instrument must be at least 2 characters.",
  }),
  nickname: z.string().min(2, {
    message: "Nickname must be at least 2 characters.",
  }),  
})

export function FormFrame({children, machineState}) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      instrument: "",
      nickname: "",
    },
  })

  const { data: session } = useSession();

  function onSubmit(data) {

    console.log(data);
    addInstrument(session?.user?.email, data.instrument, data.nickname)
    
  }

  // Return the form only if machineState is "Machine"
  if (machineState === "Machine") {
    return (
      <div className="relative top-[52px] w-[184px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormInput name={"instrument"} label={"Instrument"} form={form} />
            <FormInput name={"nickname"} label={"Nickname"} optional form={form} />
            {children}
          </form>
        </Form>
      </div>
    );
  }

  // Return null if the condition is not met
  return null;

}
