"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useDeleteDropdown, useGetDropdown } from "@/hooks/useDropdowns";
import Loading from "../Loading";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Database,
  PencilLine,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";

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

  return (
    <TooltipProvider delayDuration={100}>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="icon">
                    <Link href={editLink} aria-label="Edit dropdown">
                      <PencilLine className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        disabled={!doc?._id || isPending}
                        aria-label="Delete dropdown"
                      >
                        <Trash2
                          className={`h-4 w-4 ${
                            isPending ? "animate-pulse" : ""
                          }`}
                        />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete “{doc?.name}”?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. It will permanently remove
                      the dropdown and all its values.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                      disabled={isPending}
                    >
                      {isPending ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            <span>Created: {formatDate(doc?.created_at)}</span>
            <span className="mx-2">•</span>
            <span>Last updated: {formatDate(doc?.updated_at)}</span>
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
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or value…"
                  className="pl-8"
                />
              </div>

              {/* Chips preview */}
              <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card px-3 py-3">
                <div className="flex flex-wrap gap-2">
                  {(filtered.length ? filtered : doc.values)
                    .slice(0, 32)
                    .map((v, i) => (
                      <Badge
                        key={`${v.name}-${i}`}
                        className="px-3 py-1 rounded-xl"
                        variant="secondary"
                      >
                        {v.name}
                      </Badge>
                    ))}
                  {(filtered.length ? filtered : doc.values).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No matches.
                    </span>
                  )}
                </div>
              </ScrollArea>

              {/* Values table */}
              <div className="rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Name</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(filtered.length ? filtered : doc.values).map((v, i) => (
                      <TableRow
                        key={`${v.name}-${i}`}
                        className="hover:bg-muted/40"
                      >
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            {v.value}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(filtered.length ? filtered : doc.values).length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-sm text-muted-foreground"
                        >
                          No values to display.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
