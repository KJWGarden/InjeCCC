interface LastUpdatedProps {
  date: Date | string | null | undefined;
}

export function LastUpdated({ date }: LastUpdatedProps) {
  if (!date) return null;

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;

  const formatted = d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <span className="text-xs text-muted-foreground whitespace-nowrap">
      최종 수정: {formatted}
    </span>
  );
}
