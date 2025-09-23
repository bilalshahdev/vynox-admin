"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { useGetFeedback } from "@/hooks/useFeedbacks";
import { Feedback } from "@/types/api.types";
import { Smartphone, Star, Tablet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import Loading from "../Loading";
import formatDateTimeNoYear from "@/utils/formatDateTimeNoYear";

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
      limit: 10,
      os_type: osFilter === "all" ? undefined : (osFilter as "android" | "ios"),
      rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
      reason: reasonFilter === "all" ? undefined : reasonFilter,
    };
  }, [page, osFilter, ratingFilter, reasonFilter]);
  const { data: fetched, isLoading: isLoadingFeedback } = useGetFeedback(query);

  const {
    pagination: { total = 0, limit = 10 } = { total: 0, limit: 10 },
    data: servers = [],
  } = fetched ?? { pagination: { total: 0, limit: 10 } };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating === 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const cols = [
    "Rating",
    "Server",
    "os",
    "Reason",
    "Review",
    "Date",
  ];

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
          {"..."+feedback.server_id.slice(-4)}
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

  if (isLoadingFeedback) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 h-full">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Select value={osFilter} onValueChange={setOsFilter}>
            <SelectTrigger className="w-36 h-11">
              <SelectValue placeholder="OS Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All OS</SelectItem>
              <SelectItem value="android">Android</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="Connection Issues">
                Connection Issues
              </SelectItem>
              <SelectItem value="Speed Issues">Speed Issues</SelectItem>
              <SelectItem value="App Issues">App Issues</SelectItem>
              <SelectItem value="General Feedback">General Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="mt-6 rounded-md border">
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
        />
      </div>
    </div>
  );
}
