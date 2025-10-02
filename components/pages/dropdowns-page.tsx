"use client";

import { TableCell } from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useDeleteDropdown, useGetDropdowns } from "@/hooks/useDropdowns";
import type { Dropdown } from "@/types/api.types";
import { Search } from "lucide-react";
import TableActions from "../Actions";
import { DataTable } from "../DataTable";
import { SearchInput } from "../SearchInput";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function DropdownsPage() {
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState("");

  // reset page on search change
  useEffect(() => {
    setPage(1);
  }, [searchName]);

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      name: searchName || undefined,
    }),
    [page, searchName]
  );

  const { data, isLoading } = useGetDropdowns(query);
  const { mutateAsync: deleteDropdown } = useDeleteDropdown();

  const dropdowns: Dropdown[] = data?.data ?? [];

  const cols = useMemo(() => ["Name", "Values", "Updated", "actions"], []);

  const rows = (row: Dropdown) => {
    return (
      <>
        <TableCell className="font-medium">{row.name}</TableCell>

        <TableCell className="">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="text-blue-500">{`${
                row.values?.length ?? 0
              } values`}</div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-wrap gap-2">
                {row.values?.map((v) => (
                  <Badge key={v.name}>{v.name}</Badge>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        </TableCell>

        <TableCell className="text-xs text-muted-foreground">
          {new Date(row.updated_at).toLocaleString()}
        </TableCell>

        <TableCell className="text-right">
          <TableActions
            id={row._id}
            baseRoute="/dropdowns"
            actions={["view", "edit", "delete"]}
            onDelete={(id) => deleteDropdown(id)}
          />
        </TableCell>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SearchInput
            placeholder="Search by dropdown name…"
            onChange={(val) => setSearchName(val)}
            debounceDelay={400}
            className="pl-8 h-11 bg-muted"
          />
        </div>
      </div>

      <div>
        <DataTable
          data={dropdowns}
          isLoading={isLoading}
          cols={cols}
          row={rows}
          pagination={{
            total: data?.pagination?.total,
            limit: data?.pagination?.limit,
            page: data?.pagination?.page ?? page,
            setPage,
          }}
        />
      </div>
    </div>
  );
}
