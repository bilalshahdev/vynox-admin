"use client";

import { TableCell } from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import Loading from "../Loading";
import { useGetServersWithConnectionStats } from "@/hooks/useConnectivity";
import { ConnectivityServer } from "@/types/api.types";

export function ConnectivityPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetServersWithConnectionStats(page);
  const [servers, setServers] = useState<ConnectivityServer[]>([]);

  useEffect(() => {
    if (data?.data) setServers(data.data);
  }, [data]);

  const cols = useMemo(
    () => [
      "Server",
      "Country",
      "City",
      "IP",
      "Active Connections",
      "Total Connections",
    ],
    []
  );

  const rows = (row: ConnectivityServer) => {
    return (
      <>
        <TableCell className="font-mono text-xs">{row.server.name}</TableCell>
        <TableCell className="whitespace-nowrap">
          {row.server.country}
        </TableCell>
        <TableCell className="whitespace-nowrap">{row.server.city}</TableCell>
        <TableCell className="font-mono text-xs">{row.server.ip}</TableCell>
        <TableCell className="tabular-nums">{row.connections.active}</TableCell>
        <TableCell className="tabular-nums">{row.connections.total}</TableCell>
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
          data={servers}
          cols={cols}
          row={rows}
          pagination={pagination}
        />
      </div>
    </div>
  );
}
