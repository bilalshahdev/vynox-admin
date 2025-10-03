"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table";
import { osTypes } from "@/config/options";
import { useGetFeedback } from "@/hooks/useFeedbacks";
import { Feedback } from "@/types/api.types";
import formatDateTimeNoYear from "@/utils/formatDateTimeNoYear";
import { Smartphone, Star, Tablet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import Selectable from "../forms/fields/Selectable";

export default function FeedbackPage() {
  const [page, setPage] = useState(1);
  const [osFilter, setOsFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [reasonFilter, setReasonFilter] = useState<string>("all");

  useEffect(() => {
    setPage(1);
  }, [osFilter, ratingFilter, reasonFilter]);

  const query = useMemo(() => {
    return {
      page,
      limit: 20,
      os_type: osFilter === "all" ? undefined : (osFilter as "android" | "ios"),
      rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
      reason: reasonFilter === "all" ? undefined : reasonFilter,
    };
  }, [page, osFilter, ratingFilter, reasonFilter]);
  const { data: fetched, isLoading: isLoadingFeedback } = useGetFeedback(query);

  const {
    pagination: { total = 0, limit = 20 } = { total: 0, limit: 20 },
    data: servers = [],
  } = fetched ?? { pagination: { total: 0, limit: 20 } };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating === 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const cols = ["Rating", "Server", "os", "Reason", "Review", "Date"];

  const rows = (feedback: Feedback) => {
    return (
      <>
        <TableCell className="flex items-center gap-2">
          <Badge className={getRatingBadgeColor(feedback.rating)}>
            <Star className="mr-1 h-3 w-3 fill-current" />
            {feedback.rating}
          </Badge>
        </TableCell>
        <TableCell className="font-medium">
          {"..." + feedback.server_id.slice(-4)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            {feedback.os_type === "android" ? (
              <Smartphone className="h-4 w-4 text-green-600" />
            ) : (
              <Tablet className="h-4 w-4 text-blue-600" />
            )}
            <span className="capitalize">{feedback.os_type}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline">{feedback.reason}</Badge>
        </TableCell>
        <TableCell>
          <div className="max-w-xs truncate" title={feedback.review}>
            {feedback.review}
          </div>
        </TableCell>

        <TableCell> {formatDateTimeNoYear(feedback.created_at)}</TableCell>
      </>
    );
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Selectable
            options={osTypes}
            value={osFilter}
            onChange={setOsFilter}
          />

          <Selectable
            options={[
              { label: "All Reasons", value: "all" },
              { label: "Connection Issues", value: "Connection Issues" },
              { label: "Speed Issues", value: "Speed Issues" },
              { label: "App Issues", value: "App Issues" },
              { label: "General Feedback", value: "General Feedback" },
            ]}
            value={reasonFilter}
            onChange={setReasonFilter}
          />
        </div>
      </div>

      <DataTable
        data={servers}
        cols={cols}
        row={rows}
        pagination={{
          total,
          limit,
          page,
          setPage,
        }}
        isLoading={isLoadingFeedback}
      />
    </div>
  );
}
