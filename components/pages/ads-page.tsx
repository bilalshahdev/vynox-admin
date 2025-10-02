"use client";

import { TableCell } from "@/components/ui/table";
import { osTypes, statusTypes } from "@/config/options";
import { useDeleteAd, useGetAds } from "@/hooks/useAds";
import { Ad } from "@/types/api.types";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TableActions from "../Actions";
import { DataTable } from "../DataTable";
import Selectable from "../forms/fields/Selectable";
import OSType from "../OSType";
import { Badge } from "../ui/badge";

export function AdsPage() {
  const [page, setPage] = useState(1);
  const [osFilter, setOsFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setPage(1);
  }, [osFilter, statusFilter]);

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
            <OSType os_type={ad.os_type} />
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

  return (
    <div className="space-y-8 h-full">
      {/* Ads Management */}
      <div className="flex rounded-lg flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Selectable
            value={osFilter}
            onChange={setOsFilter}
            options={osTypes}
          />
          <Selectable
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusTypes}
          />
        </div>
      </div>

      <div>
        <DataTable
          isLoading={isLoading}
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
