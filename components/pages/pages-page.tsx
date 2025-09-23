"use client";

import { TableCell } from "@/components/ui/table";
import { useGetPages, useDeletePage } from "@/hooks/usePages";
import type { Page } from "@/lib/types"; // or "@/types/api.types"
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import Loading from "../Loading";
import TableActions from "../Actions";

export function PagesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPages({ page });
  const { mutateAsync: deletePage, isPending } = useDeletePage();
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    if (data?.data) setPages(data.data);
  }, [data]);

  const cols = useMemo(() => ["Title", "Type", "Description", "actions"], []);

  const rows = (row: Page) => {
    return (
      <>
        <TableCell className="font-mono text-xs">{row.title}</TableCell>
        <TableCell className="font-mono text-xs">{row.type}</TableCell>
        <TableCell className="max-w-[200px] truncate whitespace-nowrap text-xs">
          {row.description}
        </TableCell>
        <TableCell className="tabular-nums">
          <TableActions
            id={row._id}
            baseRoute="/pages"
            actions={["edit", "delete"]}
            onDelete={(id) => deletePage(id)}
          />
        </TableCell>
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
          data={pages}
          cols={cols}
          row={rows}
          pagination={pagination}
        />
      </div>
    </div>
  );
}
