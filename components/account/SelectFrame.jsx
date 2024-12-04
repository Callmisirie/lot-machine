import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function SelectFrame({ label, details, setSelectedCountry }) {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col w-full">
        <div className="flex w-full justify-between">
          {label && (
            <label className="l2r text-n-500">
              {label}
            </label>
          )}
        </div>
        <Select onValueChange={(value) => {
          setSelectedCountry(value);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={details.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {details.values.map((value, idx) => (
                <SelectItem key={idx} value={value.value}>
                  {value.value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

