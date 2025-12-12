// SearchSelect.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

export type SearchSelectOption = {
  value: string;
  label: string;
};

interface SearchSelectProps {
  control: any;
  name: string;
  label?: string;
  options: SearchSelectOption[];
  placeholder?: string;
  onSearchInput?: (value: string) => void;
  onValueSelect?: (val: string | null) => void;
  debounceMs?: number;
  selectedLabel?: string;
  disabled?: boolean;
}

export default function SearchSelect({
  control,
  name,
  label,
  options,
  placeholder = "Select...",
  onSearchInput,
  onValueSelect,
  debounceMs = 400,
  selectedLabel,
  disabled,
}: SearchSelectProps) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        onSearchInput?.(val);
      }, debounceMs),
    [onSearchInput, debounceMs]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const filtered =
    query === ""
      ? options
      : options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const sel = options.find((o) => o.value === field.value) || null;
        const display = selectedLabel || sel?.label || "";

        return (
          <div className="space-y-1">
            {label && (
              <label className="block text-sm font-medium">{label}</label>
            )}

            <Combobox
              as="div"
              value={field.value}
              onChange={(val: string | null) => {
                field.onChange(val);
                onValueSelect?.(val);
              }}
              disabled={disabled}
            >
              <div className="relative">
                <ComboboxInput
                  className={cn(
                    "flex h-10 w-full rounded-md border bg-secondary/50 px-3 py-2 text-sm",
                    "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder={placeholder}
                  displayValue={() => display}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    debouncedSearch(val);
                  }}
                />
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                  {filtered.length === 0 ? (
                    <div className="cursor-default px-3 py-2 text-sm text-gray-500">
                      No results found.
                    </div>
                  ) : (
                    filtered.map((opt) => (
                      <ComboboxOption
                        key={opt.value}
                        value={opt.value}
                        className={({ focus }) =>
                          `cursor-pointer px-3 py-2 text-sm ${focus ? "bg-blue-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {opt.label}
                      </ComboboxOption>
                    ))
                  )}
                </ComboboxOptions>
              </div>
            </Combobox>
          </div>
        );
      }}
    />
  );
}
