"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { useDeleteAd, useGetAds } from "@/hooks/useAds";
import { Eye, EyeOff, Smartphone, Tablet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TableActions from "../Actions";
import { DataTable } from "../DataTable";
import Loading from "../Loading";
import { Badge } from "../ui/badge";
import { Ad } from "@/types/api.types";

export function AdsPage() {
  const [page, setPage] = useState(1);
  const [osFilter, setOsFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setPage(1);
  }, [osFilter, statusFilter]);

  // Build query params for API
  const query = useMemo(() => {
    return {
      page,
      limit: 10,
      os_type: osFilter === "all" ? undefined : (osFilter as "android" | "ios"),
      status:
        statusFilter === "all"
          ? undefined
          : statusFilter === "true"
          ? true
          : false,
    };
  }, [page, osFilter, statusFilter]);

  const { data, isLoading } = useGetAds(query);
  const { mutateAsync: deleteAd } = useDeleteAd();

  const {
    pagination: { total = 0, limit = 10 } = { total: 0, limit: 10 },
    data: ads = [],
  } = data ?? { pagination: { total: 0, limit: 10 } };

  const handleDeleteAd = async (adId: string) => {
    await deleteAd(adId);
  };

  const cols = ["ad id", "type", "position", "OS type", "status", "actions"];
  const rows = (ad: Ad) => {
    return (
      <>
        <TableCell className="font-mono text-sm max-w-48 truncate">
          {ad.ad_id}
        </TableCell>
        <TableCell>{ad.type}</TableCell>
        <TableCell>{ad.position}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            {ad.os_type === "android" && (
              <Smartphone className="h-4 w-4 text-green-600" />
            )}
            {ad.os_type === "ios" && (
              <Tablet className="h-4 w-4 text-cyan-600" />
            )}

            <span className="capitalize">{ad.os_type}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant={ad.status ? "default" : "secondary"}
            className={ad.status ? "bg-green-100 text-green-800" : ""}
          >
            {ad.status ? (
              <>
                <Eye className="mr-1 h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <EyeOff className="mr-1 h-3 w-3" />
                Inactive
              </>
            )}
          </Badge>
        </TableCell>
        <TableCell>
          <TableActions
            id={ad._id}
            baseRoute="/ads"
            actions={["edit", "delete"]}
            onDelete={(id) => handleDeleteAd(id)}
          />
        </TableCell>
      </>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-8 h-full">
      {/* Ads Management */}
      <div className="flex rounded-lg flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Select value={osFilter} onValueChange={setOsFilter}>
            <SelectTrigger className="w-36 h-11">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="android">Android</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-11">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <DataTable
          data={ads}
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
    </div>
  );
}
