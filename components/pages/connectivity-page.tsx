"use client";

import { TableCell } from "@/components/ui/table";
import { useGetConnectivity } from "@/hooks/useConnectivity";
import type { Connectivity } from "@/lib/types"; // or "@/types/api.types"
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import Loading from "../Loading";
import formatDateTimeNoYear from "@/utils/formatDateTimeNoYear";
import formatDurationMS from "@/utils/formatDurationMS";

export function ConnectivityPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetConnectivity({ page });
  const [connections, setConnections] = useState<Connectivity[]>([]);
  const [now, setNow] = useState<number>(Date.now()); // for live duration ticking

  useEffect(() => {
    if (data?.data) setConnections(data.data);
  }, [data]);

  // Tick every second to refresh durations for open sessions
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const cols = useMemo(
    () => ["User ID", "Server", "Connected At", "Disconnected At", "Duration"],
    []
  );

  const rows = (row: Connectivity) => {
    const connectedAtStr = formatDateTimeNoYear(row.connected_at);
    const disconnectedAtStr = row.disconnected_at
      ? formatDateTimeNoYear(row.disconnected_at)
      : "—";

    const start = new Date(row.connected_at).getTime();
    const end = row.disconnected_at
      ? new Date(row.disconnected_at).getTime()
      : now;

    const duration = formatDurationMS(end - start);

    return (
      <>
        <TableCell className="font-mono text-xs">{row.user_id}</TableCell>
        <TableCell className="font-mono text-xs">{`…${row.server_id.slice(
          -4
        )}`}</TableCell>
        <TableCell className="whitespace-nowrap">{connectedAtStr}</TableCell>
        <TableCell className="whitespace-nowrap">{disconnectedAtStr}</TableCell>
        <TableCell className="tabular-nums">{duration}</TableCell>
      </>
    );
  };

  if (isLoading) return <Loading />;

  const pagination = {
    total: data?.pagination?.total,
    limit: data?.pagination?.limit,
    page: data?.pagination?.page,
    setPage,
  };

  return (
    <div className="space-y-8 h-full">
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <DataTable
          data={connections}
          cols={cols}
          row={rows}
          pagination={pagination}
        />
      </div>
    </div>
  );
}
