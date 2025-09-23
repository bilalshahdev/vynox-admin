"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  hint?: string; // tooltip text
  subline?: ReactNode; // small secondary line under value
  className?: string;
};

export function StatCard({
  title,
  value,
  icon,
  hint,
  subline,
  className,
}: StatCardProps) {
  const body = (
    <Card
      className={cn(
        "border-0 shadow-sm bg-gradient-to-br from-card to-muted/20",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em]">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground leading-tight">
          {value}
        </div>
        {subline ? (
          <div className="text-sm text-muted-foreground mt-1">{subline}</div>
        ) : null}
      </CardContent>
    </Card>
  );

  if (!hint) return body;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{body}</TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-relaxed">
          {hint}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
