// Format like 01-Sep-2026
export function formatDate(iso: string): string {
  // Backend may return naive UTC timestamps; treat them as UTC
  const d = new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`);
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-GB", { month: "short" });
  return `${day}-${mon}-${d.getFullYear()}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`);
  return isNaN(d.getTime()) ? "-" : `${formatDate(iso)} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}
