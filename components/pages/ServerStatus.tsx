"use client";

import { streamServerStatus } from "@/services/servers";
import { useEffect, useRef, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    YAxis
} from "recharts";
import ServerStatusSkeleton from "../ServerStatusSkeleton";

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <div
    className={`rounded-xl p-4 text-center border shadow ${color}/30 bg-${color}/10`}
  >
    <p className="text-gray-400 text-sm">{title}</p>
    <p className={`text-${color} text-lg font-semibold`}>{value}</p>
  </div>
);

/** ---------- Main Component ---------- */
interface ServerStatusProps {
  ip: string;
}

export default function ServerStatus({ ip }: ServerStatusProps) {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<
    {
      cpu: number;
      ram: number;
      download: number;
      upload: number;
    }[]
  >([]);

  const maxPoints = 30;
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!ip) return;

    const eventSource = streamServerStatus(ip);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data);
        setLoading(false);

        setHistory((prev) => {
          const updated = [
            ...prev,
            {
              cpu: data.cpu?.percentage ?? 0,
              ram: data.ram?.percentage ?? 0,
              download: parseFloat(
                data.server_actual?.download_speed?.replace(/[^\d.]/g, "") ||
                  "0"
              ),
              upload: parseFloat(
                data.server_actual?.upload_speed?.replace(/[^\d.]/g, "") || "0"
              ),
            },
          ];
          return updated.slice(-maxPoints);
        });
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.addEventListener("error", () => {
      setError("Unable to fetch live server status");
      setLoading(false);
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [ip]);

  if (loading) return <ServerStatusSkeleton />;

  if (error) return <p className="text-red-600 text-sm text-center">{error}</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="CPU"
          value={`${status?.cpu?.percentage ?? 0}%`}
          color="blue-400"
        />
        <StatCard
          title="RAM"
          value={`${status?.ram?.percentage ?? 0}%`}
          color="purple-400"
        />
        <StatCard
          title="Download"
          value={status?.server_actual?.download_speed ?? "0 KB/s"}
          color="emerald-400"
        />
        <StatCard
          title="Upload"
          value={status?.server_actual?.upload_speed ?? "0 KB/s"}
          color="amber-400"
        />
        <StatCard
          title="Clients"
          value={status?.clients ?? 0}
          color="rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4">
        <div className="h-68">
          <h3 className="text-gray-500 text-sm mb-2 font-medium">
            CPU & RAM Usage
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={history}
              margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="5 5"
                stroke="#4b5563"
                opacity={0.15}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="linear"
                dataKey="cpu"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="CPU (%)"
              />
              <Line
                type="linear"
                dataKey="ram"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="RAM (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-68">
          <h3 className="text-gray-500 text-sm mb-2 font-medium">
            Network Speed
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={history}
              margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="5 5"
                stroke="#4b5563"
                opacity={0.15}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="linear"
                dataKey="download"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="Download (KB/s)"
              />
              <Line
                type="linear"
                dataKey="upload"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name="Upload (KB/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
