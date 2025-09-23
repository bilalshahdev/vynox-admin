export default function formatDateTimeNoYear(iso: string) {
  const d = new Date(iso);
  // Uses user’s locale/timezone; omit year
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(d);
}
