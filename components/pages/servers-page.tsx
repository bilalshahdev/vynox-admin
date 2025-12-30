"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableHead } from "@/components/ui/table";
import { baseUrl } from "@/config/constants";
import { modeTypes, osTypes, protocolTypes } from "@/config/options";
import {
  useDeleteMultipleServers,
  useDeleteServer,
  useGetServers,
  useUpdateServerProStatus,
} from "@/hooks/useServers";
import { Protocol, ServerFlat, ServerMode } from "@/types/api.types";
import {
  Globe,
  Power,
  Search,
  TestTube,
  Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import TableActions from "../Actions";
import { DataTable } from "../DataTable";
import OSType from "../OSType";
import { SearchInput } from "../SearchInput";
import Selectable from "../forms/fields/Selectable";

export function ServersPage() {
  const [page, setPage] = useState(1);
  const [osFilter, setOsFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [protocolFilter, setProtocolFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [osFilter, modeFilter, searchTerm]);

  useEffect(() => {
    const storedOs = localStorage.getItem("osFilter");
    if (storedOs) setOsFilter(storedOs);
  }, []);

  useEffect(() => {
    localStorage.setItem("osFilter", osFilter);
  }, [osFilter]);

  const query = useMemo(() => {
    return {
      page,
      limit: 20,
      os_type: osFilter === "all" ? undefined : (osFilter as "android" | "ios"),
      mode: modeFilter === "all" ? undefined : (modeFilter as ServerMode),
      protocol: protocolFilter === "all" ? undefined : (protocolFilter as Protocol),
      search: searchTerm || undefined,
    };
  }, [page, osFilter, modeFilter, protocolFilter, searchTerm]);

  const { data, isLoading } = useGetServers(query);
  const { mutate: updateProStatus, isPending: updatingPro } = useUpdateServerProStatus();
  const { mutateAsync: deleteServer } = useDeleteServer();
  const { mutateAsync: deleteMultipleServers } =
    useDeleteMultipleServers();

  const {
    pagination: { total = 0, limit = 20 } = { total: 0, limit: 20 },
    data: servers = [],
  } = data ?? { pagination: { total: 0, limit: 20 } };

  // handle single delete
  const handleDeleteServer = async (serverId: string) => {
    await deleteServer(serverId);
  };

  // handle bulk delete
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.warning("No servers selected");
      return;
    }
    await deleteMultipleServers(selectedIds);
    setSelectedIds([]);
    setSelectAll(false);
  };

  // toggle single select
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(servers.map((s) => s._id));
    }
    setSelectAll(!selectAll);
  };

  const cols = [
    "", // for checkbox
    "server",
    "location",
    "os",
    "mode",
    "protocol",
    "pro",
    "ip",
    "actions",
  ];

  const rows = (server: ServerFlat) => {
    const isSelected = selectedIds.includes(server._id);

    return (
      <>
        {/* Checkbox */}
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelect(server._id)}
          />
        </TableCell>

        {/* Server Name */}
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vynox-primary/10">
              <Globe className="h-4 w-4 text-vynox-primary" />
            </div>
            {server.name}
          </div>
        </TableCell>

        {/* Location */}
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

        {/* OS */}
        <TableCell>
          <OSType os_type={server.os_type} />
        </TableCell>

        {/* Mode */}
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

        {/* Protocol */}
        <TableCell>
          {server?.protocol ?? "-"}
        </TableCell>

        {/* Pro / Free */}
        <TableCell>
          <div className="flex items-center gap-2">
            <Switch
              checked={server.is_pro}
              disabled={updatingPro}
              onCheckedChange={(checked) =>
                updateProStatus({
                  id: server._id,
                  is_pro: Boolean(checked),
                })
              }
            />

            {server.is_pro ? (
              <span className="text-yellow-700 font-medium">Pro</span>
            ) : (
              <span className="text-muted-foreground">Free</span>
            )}
          </div>
        </TableCell>

        {/* IP */}
        <TableCell className="font-mono text-sm cursor-pointer underline text-blue-500">
          <Link href={`/servers/${server.ip}/status`}>{server.ip}</Link>
        </TableCell>

        {/* Actions */}
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
      {/* Filters */}
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
            options={protocolTypes}
            value={protocolFilter}
            onChange={setProtocolFilter}
          />
          <Selectable
            options={modeTypes}
            value={modeFilter}
            onChange={setModeFilter}
          />
        </div>
      </div>

      {/* Table */}
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
        headClassName="first:w-10"
        headerClassName="relative"
      >
        <TableHead className="flex items-center justify-between gap-2">
          <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} />
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </TableHead>
      </DataTable>
    </div>
  );
}
