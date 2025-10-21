"use client";

import { useState, useEffect } from "react";
import { useRedis } from "@/hooks/useRedis";
import { RedisResetType } from "@/types/api.types";
import { Loader2, Clock } from "lucide-react";

interface Cache {
  label: string;
  value: RedisResetType | "";
}

export default function Redis() {
  const caches: Cache[] = [
    { label: "all", value: "" },
    { label: "dashboard", value: "dashboard" },
    { label: "servers", value: "servers" },
    { label: "ads", value: "ads" },
    { label: "feedback", value: "feedback" },
    { label: "connectivity", value: "connectivity" },
    { label: "pages", value: "pages" },
    { label: "faqs", value: "faq" },
    { label: "countries", value: "countries" },
    { label: "cities", value: "cities" },
    { label: "dropdowns", value: "dropdowns" },
  ];

  const { mutate: resetRedis, isPending } = useRedis();

  const [active, setActive] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const updated: Record<string, number> = {};
        for (const key in prev) {
          const next = prev[key] - 1;
          if (next > 0) updated[key] = next;
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleReset = (cache: RedisResetType | "") => {
    setActive(cache);

    const options = {
      onSettled: () => {
        setActive(null);
        // start cooldown for 15s
        setCooldowns((prev) => ({
          ...prev,
          [cache || "all"]: 15,
        }));
      },
    };

    if (cache) resetRedis({ group: cache }, options);
    else resetRedis(undefined, options);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {caches.map((cache) => {
        const isLoading = isPending && active === cache.value;
        const remaining = cooldowns[cache.value || "all"];
        const isDisabled = !!remaining || isLoading;

        return (
          <button
            key={cache.label}
            onClick={() => handleReset(cache.value)}
            disabled={isDisabled}
            className={`flex flex-col items-center justify-center h-40 rounded-2xl border bg-muted shadow-md transition-all duration-300 ${
              isDisabled
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-lg cursor-pointer"
            } ${isLoading ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                <p className="text-gray-500 text-sm mt-2">
                  Resetting {cache.label} cache...
                </p>
              </>
            ) : remaining ? (
              <>
                <Clock className="w-6 h-6 text-gray-500 mb-2" />
                <p className="text-gray-500 text-sm">
                  Available in {remaining}s
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold capitalize">
                  {cache.label}
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  Reset {cache.label} cached data
                </p>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
