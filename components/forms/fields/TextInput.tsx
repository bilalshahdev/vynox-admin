import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useController, Control } from "react-hook-form";

// Allow both input and textarea props
type CombinedProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

interface TextInputProps extends CombinedProps {
  label?: string;
  note?: string;
  control: Control<any>;
  name: string;
  type?: "text" | "email" | "number" | "textarea";
  icon?: React.ReactNode;
  className?: string;
}

const TextInput = ({
  label,
  note,
  control,
  name,
  type = "text",
  icon,
  className,
  ...props
}: TextInputProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="capitalize">
          {label}{" "}
          <span className="text-muted-foreground text-xs normal-case">
            {note && `(${note})`}
          </span>
        </Label>
      )}

      <div className="relative flex items-center">
        {type === "textarea" ? (
          <Textarea
            {...(field as any)} // safely spread field (react-hook-form will handle it)
            {...props}
            className={`bg-secondary/50 w-full ${
              error ? "border-red-500 focus:ring-red-500" : ""
            }`}
            onChange={(e) => field.onChange(e.target.value)}
          />
        ) : (
          <>
            <Input
              {...field}
              {...props}
              type={type}
              className={`bg-secondary/50 w-full ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
              onChange={(e) =>
                field.onChange(
                  type === "number"
                    ? Number(e.target.value) || 0
                    : e.target.value
                )
              }
            />
            {icon && (
              <Button
                size="icon"
                type="button"
                className="absolute inset-y-0 right-0 flex items-center justify-center rounded-md"
              >
                {icon}
              </Button>
            )}
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default TextInput;
