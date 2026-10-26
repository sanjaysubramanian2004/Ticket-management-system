import { Box } from "@mui/material";
import type { TicketStatus } from "../types";

export const STATUS_STYLE: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  OPEN: { label: "Open", color: "#1B5FA8", bg: "#E6F0FA" },
  IN_PROGRESS: { label: "In progress", color: "#9A5B00", bg: "#FFF1D6" },
  CLOSED: { label: "Closed", color: "#2E7D4F", bg: "#E3F4EA" },
};

export default function StatusChip({ status }: { status: TicketStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.4,
        borderRadius: 99, bgcolor: s.bg, color: s.color, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
      }}
    >
      <Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: s.color }} />
      {s.label}
    </Box>
  );
}
