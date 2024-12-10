"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ComboboxInput({userInstruments, selectInstrument, setSelectInstrument}) {
  const [open, setOpen] = React.useState(false)

  const instruments = userInstruments?.map((instrument) => {
    return ({
      value: instrument.instrument,
      label: instrument.instrument
    })
  })

  return (
    <div className="flex flex-col w-fit">
      <p className="l2r text-n-500"> Instument</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="custom"
            size="customSize"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            <div className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            {selectInstrument
              ? instruments?.find((instrument) => instrument.value === selectInstrument)?.label
              : "Select instrument..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white">
          <Command>
            <CommandInput placeholder="Search instrument..." />
            <CommandList>
              <CommandEmpty>No instrument found.</CommandEmpty>
              <CommandGroup>
                {instruments?.map((instrument) => (
                  <CommandItem
                    key={instrument.value}
                    value={instrument.value}
                    onSelect={(currentValue) => {
                      setSelectInstrument(currentValue === selectInstrument ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectInstrument === instrument.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {instrument.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>      
    </div>
  )
}
