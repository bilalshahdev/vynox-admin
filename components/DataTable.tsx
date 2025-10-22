// components/DataTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Pagination from "./Pagination";
import NoData from "./NoData";
import TableSkeleton from "./TableSkeleton";
import React from "react";

type DataTableProps<T> = {
  data: T[];
  cols: string[];
  row: (row: T, index: number) => React.ReactNode;
  tableClassName?: string;
  bodyClassName?: string;
  headClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  pagination?: {
    total: number | undefined;
    page: number | undefined;
    limit: number | undefined;
    setPage: (page: number) => void;
  };
  /** ✅ New: Support for custom children (toolbar, filters, etc.) */
  children?: React.ReactNode;
};

export function DataTable<T>({
  data,
  cols,
  row,
  tableClassName,
  bodyClassName,
  headClassName,
  headerClassName,
  rowClassName,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  emptyAction,
  pagination = {
    total: 0,
    page: 1,
    limit: 20,
    setPage: () => {},
  },
  children,
}: DataTableProps<T>) {
  const showEmpty = !isLoading && data.length === 0;

  return (
    <div className="flex flex-col gap-4 md:gap-8 h-full">
      {/* ✅ render any custom top elements like filters, buttons, etc. */}
      {children && <div className="w-full">{children}</div>}

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : showEmpty ? (
        <NoData
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
          className="h-96"
        />
      ) : (
        <Table className={cn("max-h-full", tableClassName)}>
          <>
            <TableHeader className={cn("", headerClassName)}>
              <TableRow className={cn("", rowClassName)}>
                {cols.map((col, i) => (
                  <TableHead
                    className={cn("capitalize", headClassName)}
                    key={i}
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className={cn("", bodyClassName)}>
              {data.map((r, i) => (
                <TableRow className={cn("", rowClassName)} key={i}>
                  {row(r, i)}
                </TableRow>
              ))}
            </TableBody>
          </>
        </Table>
      )}

      {pagination && (
        <Pagination
          pagination={{
            total: pagination?.total || 0,
            page: pagination?.page || 1,
            limit: pagination?.limit || 20,
          }}
          changePage={(newPage) => pagination?.setPage(newPage)}
        />
      )}
    </div>
  );
}
