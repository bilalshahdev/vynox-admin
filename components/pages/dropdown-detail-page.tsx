"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useDeleteDropdown, useGetDropdown } from "@/hooks/useDropdowns";
import Loading from "../Loading";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TableCell } from "@/components/ui/table";

import { Database, PencilLine, Trash2, TriangleAlert } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import { DataTable } from "../DataTable";
import Tooltip from "../Tooltip";

type ISODateString = string;

export interface DropdownValue {
  name: string;
  value: string;
}
export interface Dropdown {
  _id: string;
  name: string;
  values: DropdownValue[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

/* --- small utils --- */
function formatDate(d?: ISODateString) {
  if (!d) return "—";
  const date = new Date(d);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
function relativeTime(d?: ISODateString) {
  if (!d) return "";
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const then = new Date(d).getTime();
  const now = Date.now();
  const diffMs = then - now;
  const m = 60_000,
    h = 60 * m,
    dms = 24 * h;
  if (Math.abs(diffMs) < h) return rtf.format(Math.round(diffMs / m), "minute");
  if (Math.abs(diffMs) < dms) return rtf.format(Math.round(diffMs / h), "hour");
  return rtf.format(Math.round(diffMs / dms), "day");
}

export default function DropdownDetails({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading, isError } = useGetDropdown(id, true);
  const doc: Dropdown | undefined = data?.data;

  const { mutateAsync: deleteDropdown, isPending } = useDeleteDropdown();

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const list = doc?.values ?? [];
    if (!q.trim()) return list;
    const qq = q.toLowerCase();
    return list.filter(
      (v) =>
        v.name.toLowerCase().includes(qq) || v.value.toLowerCase().includes(qq)
    );
  }, [doc?.values, q]);

  const handleDelete = async () => {
    if (!doc?._id) return;
    try {
      await deleteDropdown(doc._id);

      router.push("/dropdowns");
    } catch (e: any) {
      console.log(e);
    }
  };

  if (isLoading) return <Loading />;

  const editLink = `/dropdowns/${doc?._id}/edit`;

  const cols = ["Name", "Value"];

  const row = (value: DropdownValue) => (
    <>
      <TableCell className="max-w-32 truncate">
        <Tooltip content={value.name}>
          <span>{value.name}</span>
        </Tooltip>
      </TableCell>
      <TableCell>{value.value}</TableCell>
    </>
  );

  return (
    <div className="">
      <div className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl sm:text-2xl">{doc?.name ?? ""}</div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className="gap-1">
                <Database className="h-3.5 w-3.5" />
                {doc?.values?.length ?? 0} values
              </Badge>
              <span className="text-muted-foreground">
                Updated {relativeTime(doc?.updated_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="icon">
              <Link href={editLink} aria-label="Edit dropdown">
                <PencilLine className="h-4 w-4" />
              </Link>
            </Button>

            <ConfirmDialog
              title={`Delete ${doc?.name}`}
              description={`This action cannot be undone. It will permanently remove the dropdown and all its values.`}
              onConfirm={handleDelete}
              loading={isPending}
              variant="destructive"
            >
              <Button
                variant="destructive"
                size="icon"
                disabled={!doc?._id || isPending}
                aria-label="Delete dropdown"
              >
                <Trash2
                  className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`}
                />
              </Button>
            </ConfirmDialog>
          </div>
        </div>
      </div>

      <Separator />

      <div className="pt-6 space-y-6">
        {isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <TriangleAlert className="h-4 w-4" />
            Failed to load dropdown. Try refreshing.
          </div>
        )}

        {!doc && !isError && (
          <div className="text-sm text-muted-foreground">
            No dropdown found for “{id}”.
          </div>
        )}

        {doc && (
          <div className="rounded-xl border bg-card">
            <DataTable
              data={doc.values}
              cols={cols}
              row={row}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
