export function formatTime(iso: unknown): string {
  if (typeof iso !== "string") {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateLabel(iso: unknown): string {
  if (typeof iso !== "string") {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDuration(totalSeconds: unknown): string {
  const seconds = typeof totalSeconds === "number" && Number.isFinite(totalSeconds)
    ? Math.max(0, Math.round(totalSeconds))
    : 0;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}
