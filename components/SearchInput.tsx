"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";

type Props = {
  placeholder?: string;
  onChange: (value: string) => void;
  debounceDelay?: number;
  className?: string;
  value?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export const SearchInput = ({
  placeholder = "Search...",
  onChange,
  debounceDelay = 500,
  className,
  value,
  onFocus,
  onBlur,
}: Props) => {
  const [internal, setInternal] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  useEffect(() => {
    const handler = debounce((val: string) => onChange(val), debounceDelay);
    handler(internal);
    return () => handler.cancel();
  }, [internal, onChange, debounceDelay]);

  return (
    <Input
      value={internal}
      onChange={(e) => {
        const v = e.target.value;
        setInternal(v);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className={cn("w-full max-w-sm", className)}
    />
  );
};
