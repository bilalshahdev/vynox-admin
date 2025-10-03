// app/ServersPage.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { baseUrl } from "@/config/constants";
import { modeTypes, osTypes } from "@/config/options";
import { useDeleteServer, useGetServers } from "@/hooks/useServers";
import { ServerFlat, ServerMode } from "@/types/api.types";
import { Crown, Globe, Power, Search, TestTube } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import TableActions from "../Actions";
import { DataTable } from "../DataTable";
import OSType from "../OSType";
import { SearchInput } from "../SearchInput";
import Selectable from "../forms/fields/Selectable";

export function ServersPage() {
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
      limit: 20,
      os_type: osFilter === "all" ? undefined : (osFilter as "android" | "ios"),
      mode: modeFilter === "all" ? undefined : (modeFilter as ServerMode),
      search: searchTerm || undefined,
    };
  }, [page, osFilter, modeFilter, searchTerm]);

  const { data, isLoading } = useGetServers(query);
  const { mutateAsync: deleteServer } = useDeleteServer();

  const {
    pagination: { total = 0, limit = 20 } = { total: 0, limit: 20 },
    data: servers = [],
  } = data ?? { pagination: { total: 0, limit: 20 } };

  const handleDeleteServer = async (serverId: string) => {
    await deleteServer(serverId);
  };

  const cols = ["server", "location", "os", "mode", "pro", "ip", "actions"];

  const rows = (server: ServerFlat) => {
    return (
      <>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vynox-primary/10">
              <Globe className="h-4 w-4 text-vynox-primary" />
            </div>
            {server.name}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            <Image
              src={baseUrl + "/api/v1/flags/" + server.flag}
              alt={server.country}
              width={20}
              height={20}
            />
            <div>
              <div className="font-medium">{server.city}</div>
              <div className="text-sm text-muted-foreground">
                {server.country}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <OSType os_type={server.os_type} />
        </TableCell>

        <TableCell>
          <Badge
            variant={server.mode === "live" ? "default" : "secondary"}
            className={
              server.mode === "live" ? "bg-green-100 text-green-800" : ""
            }
          >
            {server.mode === "live" ? (
              <Power className="mr-1 h-3 w-3" />
            ) : (
              <TestTube className="mr-1 h-3 w-3" />
            )}
            {server.mode}
          </Badge>
        </TableCell>

        <TableCell>
          {server.is_pro ? (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Crown className="mr-1 h-3 w-3" />
              Pro
            </Badge>
          ) : (
            <Badge variant="outline">Free</Badge>
          )}
        </TableCell>

        <TableCell className="font-mono text-sm">{server.ip}</TableCell>

        <TableCell className="text-right">
          <TableActions
            id={server._id}
            baseRoute="/servers"
            actions={["edit", "delete"]}
            onDelete={(id) => handleDeleteServer(id)}
          />
        </TableCell>
      </>
    );
  };

  return (
    <div className="space-y-8 h-full">
      <div className="flex rounded-lg flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <SearchInput
              placeholder="Search servers, locations..."
              onChange={(val) => setSearchTerm(val)}
              debounceDelay={500}
              className="pl-8 h-11 bg-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Selectable
            options={osTypes}
            value={osFilter}
            onChange={setOsFilter}
          />

          <Selectable
            options={modeTypes}
            value={modeFilter}
            onChange={setModeFilter}
          />
        </div>
      </div>
      <DataTable
        data={servers}
        isLoading={isLoading}
        cols={cols}
        row={rows}
        pagination={{
          total,
          limit,
          page,
          setPage,
        }}
      />
    </div>
  );
}
