"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";

// npm package for debounce
// npm i lodash

type Props = {
  placeholder?: string;
  onChange: (value: string) => void;
  debounceDelay?: number;
  className?: string;
};

export const SearchInput = ({
  placeholder = "Search...",
  onChange,
  debounceDelay = 500,
  className,
}: Props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = debounce((val: string) => {
      onChange(val);
    }, debounceDelay);

    handler(value);

    return () => {
      handler.cancel();
    };
  }, [value, onChange, debounceDelay]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full max-w-sm", className)}
    />
  );
};
