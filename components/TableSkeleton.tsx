// components/TableSkeleton.tsx
"use client";
export default function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 6 }).map((_, j) => (
          <div
            key={j}
            className="h-6 bg-muted rounded animate-pulse col-span-2"
          />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4">
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="h-5 bg-muted rounded animate-pulse col-span-2"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
