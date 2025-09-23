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

type DataTableProps<T> = {
  data: T[];
  cols: string[];
  row: (row: T, index: number) => React.ReactNode;
  tableClassName?: string;
  bodyClassName?: string;
  headClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  pagination?: {
    total: number | undefined;
    page: number | undefined;
    limit: number | undefined;
    setPage: (page: number) => void;
  };
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
  pagination = {
    total: 0,
    page: 1,
    limit: 10,
    setPage: () => {},
  },
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col gap-4 justify-between md:gap-8 h-full">
      {data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-muted-foreground text-sm">
          No Data
        </div>
      ) : (
        <Table className={cn("h-full", tableClassName)}>
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
            limit: pagination?.limit || 10,
          }}
          changePage={(newPage) => pagination?.setPage(newPage)}
        />
      )}
    </div>
  );
}
