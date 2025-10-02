// components/TableSkeleton.tsx
"use client";
export default function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b">
        <div className="h-4 w-24 bg-muted rounded animate-pulse col-span-2" />
        <div className="h-4 w-24 bg-muted rounded animate-pulse col-span-3" />
        <div className="h-4 w-24 bg-muted rounded animate-pulse col-span-2" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4">
            <div className="h-4 bg-muted rounded animate-pulse col-span-2" />
            <div className="h-4 bg-muted rounded animate-pulse col-span-3" />
            <div className="h-4 bg-muted rounded animate-pulse col-span-4" />
            <div className="h-4 bg-muted rounded animate-pulse col-span-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
