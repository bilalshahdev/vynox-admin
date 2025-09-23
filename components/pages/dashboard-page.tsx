"use client";

import {
  RecentActivity,
  RecentActivitySkeleton,
} from "@/components/RecentActivity";
import { StatCard } from "@/components/StatCard";
import { useDashboardStats } from "@/hooks/useDashboard";
import {
  Activity,
  Megaphone,
  Server as ServerIcon,
  Star,
  TrendingUp,
} from "lucide-react";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats(true);
  const success = data?.success === true;
  const stats = success ? (data as { success: true; data: any }).data : null;

  return (
    <div className="space-y-8">
      {/* 4 Cards: Servers, Connections, Feedbacks, Ads */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCard
              title="Servers"
              value="—"
              icon={<ServerIcon className="h-5 w-5 text-primary" />}
            />
            <StatCard
              title="Connections"
              value="—"
              icon={<Activity className="h-5 w-5 text-accent" />}
            />
            <StatCard
              title="Feedback"
              value="—"
              icon={<TrendingUp className="h-5 w-5 text-secondary" />}
            />
            <StatCard
              title="Ads"
              value="—"
              icon={<Megaphone className="h-5 w-5 text-accent" />}
            />
          </>
        ) : isError || !success ? (
          <>
            <StatCard
              title="Servers"
              value="0"
              icon={<ServerIcon className="h-5 w-5 text-primary" />}
              hint="Failed to load data."
            />
            <StatCard
              title="Connections"
              value="0"
              icon={<Activity className="h-5 w-5 text-accent" />}
            />
            <StatCard
              title="Feedback"
              value="0"
              icon={<TrendingUp className="h-5 w-5 text-secondary" />}
            />
            <StatCard
              title="Ads"
              value="0"
              icon={<Megaphone className="h-5 w-5 text-accent" />}
            />
          </>
        ) : (
          <>
            {/* Servers */}
            <StatCard
              title="Servers"
              value={stats.servers.total}
              icon={<ServerIcon className="h-5 w-5 text-primary" />}
              hint={
                `Android: ${stats.servers.by_os?.android ?? 0}\n` +
                `iOS: ${stats.servers.by_os?.ios ?? 0}\n` +
                `Live: ${stats.servers.by_mode?.live ?? 0}, Test: ${
                  stats.servers.by_mode?.test ?? 0
                }\n` +
                `Pro: ${stats.servers.pro ?? 0}`
              }
              subline={
                <span className="inline-flex items-center gap-2">
                  <span>Live {stats.servers.by_mode?.live ?? 0}</span>
                  <span>•</span>
                  <span>Test {stats.servers.by_mode?.test ?? 0}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />{" "}
                    {stats.servers.pro ?? 0} Pro
                  </span>
                </span>
              }
            />

            {/* Connections */}
            <StatCard
              title="Connections"
              value={stats.connections.active}
              icon={<Activity className="h-5 w-5" />}
              hint={`Active now: ${stats.connections.active}\nLast 24h: ${stats.connections.last_24h}`}
              subline={<span>Last 24h: {stats.connections.last_24h}</span>}
            />

            {/* Feedbacks */}
            <StatCard
              title="Feedback"
              value={stats.feedback.last_7d}
              icon={<TrendingUp className="h-5 w-5" />}
              hint={`Feedback in 7d: ${
                stats.feedback.last_7d
              }\nAvg rating (30d): ${Number(
                stats.feedback.avg_rating_30d
              ).toFixed(1)}\nTop reasons: ${
                (stats.feedback.top_reasons_7d ?? []).join(", ") || "—"
              }`}
              subline={
                <span>
                  Avg rating (30d):{" "}
                  <span className="font-medium">
                    {Number(stats.feedback.avg_rating_30d).toFixed(1)}
                  </span>
                </span>
              }
            />

            {/* Ads */}
            <StatCard
              title="Ads"
              value={`${stats.ads.active}/${stats.ads.total}`}
              icon={<Megaphone className="h-5 w-5" />}
              hint={`Active: ${stats.ads.active}\nTotal: ${stats.ads.total}`}
              subline={<span>{stats.ads.active} active</span>}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      {isLoading ? (
        <RecentActivitySkeleton />
      ) : success ? (
        <RecentActivity items={stats.recent_activity} />
      ) : null}
    </div>
  );
}
