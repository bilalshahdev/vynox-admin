"use client";

import { TableCell } from "@/components/ui/table";
import { useGetServersWithConnectionStats } from "@/hooks/useConnectivity";
import { ConnectivityServer } from "@/types/api.types";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import Loading from "../Loading";
import OSType from "../OSType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { SearchInput } from "../SearchInput";

export function ConnectivityPage() {
  const [page, setPage] = useState(1);
  const [osFilter, setOsFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setPage(1);
  }, [osFilter, modeFilter, searchTerm]);

  const query = useMemo(() => {
    return {
      page,
      limit: 10,
      os_type: osFilter === "all" ? undefined : (osFilter as "android" | "ios"),
      search: searchTerm || undefined,
    };
  }, [page, osFilter, searchTerm]);

  const { data, isLoading } = useGetServersWithConnectionStats(query);

  const [servers, setServers] = useState<ConnectivityServer[]>([]);

  useEffect(() => {
    if (data?.data) setServers(data.data);
  }, [data]);

  const cols = useMemo(
    () => [
      "Server",
      "OS Type",
      "City",
      "Active Connections",
      "Total Connections",
    ],
    []
  );

  const rows = (row: ConnectivityServer) => {
    return (
      <>
        <TableCell className="font-mono text-xs">{row.server.name}</TableCell>
        <TableCell className="font-mono text-xs">
          <OSType os_type={row.server.os_type} />
        </TableCell>
        <TableCell className="whitespace-nowrap">{row.server.city}</TableCell>
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
      <div className="flex rounded-lg flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            {/* Use your debounced SearchInput */}
            <SearchInput
              placeholder="Search servers, locations..."
              onChange={(val) => setSearchTerm(val)}
              debounceDelay={500}
              className="pl-8 h-11 bg-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={osFilter} onValueChange={setOsFilter}>
            <SelectTrigger className="w-36 h-11">
              <SelectValue placeholder="OS Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All OS</SelectItem>
              <SelectItem value="android">Android</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
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
