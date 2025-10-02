// components/NoData.tsx
"use client";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";

type NoDataProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
};

export default function NoData({
  title = "Nothing here yet",
  description,
  action,
  className,
  icon,
}: NoDataProps) {
  return (
    <div
      className={cn(
        "h-72 flex flex-col items-center justify-center rounded-xl",
        "border-border/60 text-muted-foreground",
        "p-6 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-signature/15">
        {icon ?? <Database className="h-6 w-6 text-signature/20" />}
      </div>
      <h3 className="text-base font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
