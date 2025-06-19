import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bank } from '@/types/bank';

interface BankSelectProps {
  value?: Bank;
  onValueChange?: (bank: Bank | undefined) => void;
  placeholder?: string;
  className?: string;
  defaultBankShortName?: string;
}

const BankSelect: React.FC<BankSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Chọn ngân hàng...",
  className,
  defaultBankShortName,
}) => {
  const [open, setOpen] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch('https://api.vietqr.io/v2/banks')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setBanks(data.data || []);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách ngân hàng');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (
      defaultBankShortName &&
      !value &&
      banks.length > 0
    ) {
      const found = banks.find(b => b.shortName === defaultBankShortName);
      if (found) {
        onValueChange?.(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultBankShortName, banks]);

  const handleSelect = (selectedBank: Bank) => {
    if (value?.id === selectedBank.id) {
      onValueChange?.(undefined);
    } else {
      onValueChange?.(selectedBank);
    }
    setOpen(false);
  };

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-[40px] px-3 py-2",
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang tải...</span>
            </div>
          ) : value ? (
            <div className="flex items-center gap-3 flex-1">
              <img
                src={value.logo}
                alt={value.shortName}
                className="w-8 h-8 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{value.shortName}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {value.name}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder="Tìm kiếm ngân hàng..." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy ngân hàng nào.</CommandEmpty>
            <CommandGroup>
              {banks.map((bank: Bank) => (
                <CommandItem
                  key={bank.id}
                  value={`${bank.name} ${bank.shortName} ${bank.code}`}
                  onSelect={() => handleSelect(bank)}
                  className="flex items-center gap-3 py-3"
                >
                  <img
                    src={bank.logo}
                    alt={bank.shortName}
                    className="w-8 h-8 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-sm">{bank.shortName}</span>
                    <span className="text-xs text-muted-foreground">
                      {bank.name}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value?.id === bank.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BankSelect;