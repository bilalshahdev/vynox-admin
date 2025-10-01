"use client";

import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/SearchInput";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  options: Option[];
  loading?: boolean;
  onSearch: (q: string) => void;
  onSelect: (opt: Option) => void;
  minChars?: number;
};

export function DropdownSearch({
  label,
  value,
  placeholder,
  disabled,
  options,
  loading,
  onSearch,
  onSelect,
  minChars = 2,
}: Props) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(""); 
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-2" ref={ref}>
      <span className="text-sm font-medium">{label}</span>
      <div className="relative">
        <SearchInput
          value={typed || value}
          onChange={(q) => {
            setTyped(q); 
            if (q.length >= minChars) {
              onSearch(q);
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          debounceDelay={400}
          onFocus={() => !disabled && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="w-full"
        />
        {open && !disabled && (
          <Card className="absolute z-10 mt-1 w-full max-h-64 overflow-auto p-0">
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground">Loading…</div>
            ) : options.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                No results
              </div>
            ) : (
              <ul className="divide-y">
                {options.map((o) => (
                  <li
                    key={o.value}
                    className={cn(
                      "px-3 py-2 text-sm hover:bg-secondary cursor-pointer",
                      value === o.label && "bg-secondary"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onSelect(o); // update parent state
                      setTyped(""); // clear typed query
                      setOpen(false); // CLOSE DROPDOWN
                    }}
                  >
                    {o.label}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
