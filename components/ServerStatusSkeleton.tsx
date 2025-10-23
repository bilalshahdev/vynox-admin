"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ServerStatusSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-card shadow-sm p-4 flex flex-col gap-2"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="rounded-2xl border bg-card shadow-sm p-4">
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-[240px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
