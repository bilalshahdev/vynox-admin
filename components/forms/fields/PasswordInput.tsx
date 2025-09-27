"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes, useState } from "react";
import { useController, Control } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  note?: string;
  control: Control<any>; // Or a more specific form values type if available
  name: string;
  cPassword?: string;
}

const PasswordInput = ({
  label,
  note,
  control,
  name,
  cPassword,
  ...props
}: PasswordInputProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const confirmField = useController({
    name: cPassword || "",
    control,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword((prev) => !prev);

  return (
    <>
      {/* Password Field */}
      <div className="space-y-2">
        {label && (
          <Label className="capitalize">
            {label}{" "}
            <span className="text-muted-foreground text-xs normal-case">
              {note && `(${note})`}
            </span>
          </Label>
        )}

        <div className="relative">
          <Input
            {...field}
            {...props}
            type={showPassword ? "text" : "password"}
            className={`bg-secondary/50 pr-10 ${
              error ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          <Button
            size="icon"
            type="button"
            className="absolute inset-y-0 right-0 flex items-center justify-center rounded-md"
            onClick={handleToggle}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>

      {/* Conditionally render confirm password field */}
      {cPassword && confirmField && (
        <div className="space-y-2">
          {label && <Label className="capitalize">Confirm {label}</Label>}
          <div className="relative">
            <Input
              {...confirmField.field}
              {...props}
              type={showPassword ? "text" : "password"}
              className={`bg-secondary/50 pr-10 ${
                confirmField.fieldState.error
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            <Button
              size="icon"
              type="button"
              className="absolute inset-y-0 right-0 flex items-center justify-center rounded-md"
              onClick={handleToggle}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </Button>
          </div>

          {confirmField.fieldState.error && (
            <p className="text-red-500 text-sm">
              {confirmField.fieldState.error.message}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default PasswordInput;
