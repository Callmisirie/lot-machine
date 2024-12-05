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
import { splitValue } from "@/common/splitValue"

export function ComboboxInput({countryBanks, selectedBank, setSelectedBank}) {
  const [open, setOpen] = React.useState(false)
  const banks = countryBanks?.map((bank) => {
    return ({
      value: bank.name,
      label: bank.name,
      key: bank.code
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
            {selectedBank
              ? splitValue(banks.find((bank) => bank.value === selectedBank)?.label)
              : "Select bank..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white max-h-[160px] overflow-hidden">
          <Command>
            <CommandInput placeholder="Search bank..." />
            <CommandList>
              <CommandEmpty>No bank found.</CommandEmpty>
              <CommandGroup>
                {banks?.map((bank) => (
                  <CommandItem
                    key={bank.key}
                    value={bank.value}
                    onSelect={(currentValue) => {
                      setSelectedBank(currentValue === selectedBank ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBank === bank.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {bank?.label}
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
