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

  const cards = [
    {
      key: "servers",
      title: "Servers",
      icon: <ServerIcon className="h-5 w-5 text-primary" />,
      getValue: () => (success ? stats.servers.total : isLoading ? "—" : "0"),
      getHint: () =>
        success
          ? `Android: ${stats.servers.by_os?.android ?? 0}\n` +
            `iOS: ${stats.servers.by_os?.ios ?? 0}\n` +
            `Live: ${stats.servers.by_mode?.live ?? 0}, Test: ${
              stats.servers.by_mode?.test ?? 0
            }\n` +
            `Pro: ${stats.servers.pro ?? 0}`
          : isError
          ? "Failed to load data."
          : undefined,
      getSubline: () =>
        success ? (
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
        ) : null,
    },
    {
      key: "connections",
      title: "Connections",
      icon: <Activity className="h-5 w-5" />,
      getValue: () =>
        success ? stats.connections.active : isLoading ? "—" : "0",
      getHint: () =>
        success
          ? `Active now: ${stats.connections.active}\nLast 24h: ${stats.connections.last_24h}`
          : undefined,
      getSubline: () =>
        success ? <span>Last 24h: {stats.connections.last_24h}</span> : null,
    },
    {
      key: "feedback",
      title: "Feedback",
      icon: <TrendingUp className="h-5 w-5" />,
      getValue: () =>
        success ? stats.feedback.last_7d : isLoading ? "—" : "0",
      getHint: () =>
        success
          ? `Feedback in 7d: ${
              stats.feedback.last_7d
            }\nAvg rating (30d): ${Number(
              stats.feedback.avg_rating_30d
            ).toFixed(1)}\nTop reasons: ${
              (stats.feedback.top_reasons_7d ?? []).join(", ") || "—"
            }`
          : undefined,
      getSubline: () =>
        success ? (
          <span>
            Avg rating (30d):{" "}
            <span className="font-medium">
              {Number(stats.feedback.avg_rating_30d).toFixed(1)}
            </span>
          </span>
        ) : null,
    },
    {
      key: "ads",
      title: "Ads",
      icon: <Megaphone className="h-5 w-5" />,
      getValue: () =>
        success
          ? `${stats.ads.active}/${stats.ads.total}`
          : isLoading
          ? "—"
          : "0",
      getHint: () =>
        success
          ? `Active: ${stats.ads.active}\nTotal: ${stats.ads.total}`
          : undefined,
      getSubline: () =>
        success ? <span>{stats.ads.active} active</span> : null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.getValue()}
            icon={card.icon}
            hint={card.getHint()}
            subline={card.getSubline()}
          />
        ))}
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
