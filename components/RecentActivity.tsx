"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity as ActivityIcon,
  AlertTriangle,
  Megaphone,
  Server,
} from "lucide-react";

type Item = {
  ref_id: string;
  type: "server" | "ad" | "feedback" | "connection";
  title: string;
  when: string;
};

function timeAgo(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  const m = Math.floor(s / 60),
    h = Math.floor(m / 60),
    d = Math.floor(h / 24);
  if (d) return `${d} day${d > 1 ? "s" : ""} ago`;
  if (h) return `${h} hour${h > 1 ? "s" : ""} ago`;
  if (m) return `${m} minute${m > 1 ? "s" : ""} ago`;
  return `${s} second${s > 1 ? "s" : ""} ago`;
}

function TypeIcon() {
  return <ActivityIcon className="h-4 w-4" />;
}

export function RecentActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-12 w-full rounded-lg bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}

export function RecentActivity({ items }: { items: Item[] }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <ActivityIcon className="h-4 w-4" />
          </div>
          Recent Activity
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Latest system events and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No recent activity to display.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((a) => (
              <div
                key={a.ref_id}
                className="flex shadow items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signature/40 shadow-sm">
                  <TypeIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed text-foreground">
                    {a.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    {timeAgo(a.when)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
