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

interface Ward {
  name: string
  code: number
}

interface District {
  name: string
  code: number
  wards: Ward[]
}

interface Province {
  name: string
  code: number
  districts: District[]
}

interface LocationSelectorProps {
  onChange: (location: {
    province: Province | null
    district: District | null
    ward: Ward | null
  }) => void
}

export default function LocationSelector({ onChange }: LocationSelectorProps) {
  const [provinces, setProvinces] = React.useState<Province[]>([])
  const [selectedProvince, setSelectedProvince] = React.useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null)
  const [selectedWard, setSelectedWard] = React.useState<Ward | null>(null)

  React.useEffect(() => {
    fetch("/data/vietnam.json")
      .then((res) => res.json())
      .then(setProvinces)
  }, [])

  React.useEffect(() => {
    onChange({ province: selectedProvince, district: selectedDistrict, ward: selectedWard })
  }, [selectedProvince, selectedDistrict, selectedWard, onChange])

  const Combobox = <T extends { name: string; code: number }>({
    items,
    value,
    setValue,
    placeholder,
    disabled = false
  }: {
    items: T[]
    value: T | null
    setValue: (item: T | null) => void
    placeholder: string
    disabled?: boolean
  }) => {
    const [open, setOpen] = React.useState(false)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("justify-between", disabled && "opacity-50")}
          >
            {value?.name || placeholder}
            <ChevronsUpDown className="opacity-50 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Tìm ${placeholder.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Không tìm thấy.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.code}
                    value={item.code.toString()}
                    onSelect={() => {
                      setValue(item)
                      setOpen(false)
                    }}
                  >
                    {item.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value?.code === item.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Combobox
        items={provinces}
        value={selectedProvince}
        setValue={(p) => {
          setSelectedProvince(p)
          setSelectedDistrict(null)
          setSelectedWard(null)
        }}
        placeholder="Tỉnh..."
      />
      <Combobox
        items={selectedProvince?.districts || []}
        value={selectedDistrict}
        setValue={(d) => {
          setSelectedDistrict(d)
          setSelectedWard(null)
        }}
        placeholder="Huyện..."
        disabled={!selectedProvince}
      />
      <Combobox
        items={selectedDistrict?.wards || []}
        value={selectedWard}
        setValue={setSelectedWard}
        placeholder="Xã..."
        disabled={!selectedDistrict}
      />
    </div>
  )
}
