import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Link, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import AiAssistPanel from "../components/AiAssistPanel";
import StatusChip, { STATUS_STYLE } from "../components/StatusChip";
import { STATUSES, type Ticket, type TicketStatus } from "../types";
import { formatDateTime } from "../utils";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

export default function TicketDetails() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!/^\d+$/.test(id)) {
      setError("Invalid ticket ID");
      return;
    }
    api.getTicket(id).then(setTicket).catch((e: Error) => setError(e.message));
  }, [id]);

  const handleDelete = async () => {
    if (!ticket || !window.confirm(`Delete ticket #${ticket.id}? This cannot be undone.`)) return;
    try {
      await api.deleteTicket(ticket.id);
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete ticket");
    }
  };

  const changeStatus = async (status: TicketStatus) => {
    if (!ticket) return;
    setNotice("");
    try {
      setTicket(await api.updateTicket(ticket.id, { title: ticket.title, description: ticket.description, status }));
      setNotice(`Status changed to ${STATUS_STYLE[status].label}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  if (error && !ticket)
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>
        <Button component={RouterLink} to="/">Back to tickets</Button>
      </Stack>
    );
  if (!ticket) return <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>;

  return (
    <>
      <Link component={RouterLink} to="/" underline="hover" color="text.secondary" sx={{ fontWeight: 700, fontSize: 14 }}>
        Back to tickets
      </Link>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap" sx={{ mt: 1, mb: 3 }}>
        <Box>
          <Typography color="text.secondary" sx={{ fontWeight: 700 }}>Ticket #{ticket.id}</Typography>
          <Typography variant="h5" sx={{ maxWidth: 640 }}>{ticket.title}</Typography>
        </Box>
        <Stack direction="row" gap={1}>
          <Button variant="contained" component={RouterLink} to={`/tickets/${ticket.id}/edit`}>Edit</Button>
          <Button color="error" variant="outlined" onClick={handleDelete}>Delete</Button>
        </Stack>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {notice && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice("")}>{notice}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 2.5, alignItems: "start" }}>
        <Paper sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Description</Typography>
          <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.75, overflowWrap: "anywhere" }}>{ticket.description}</Typography>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2.25}>
            <Box>
              <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Status</Typography>
              <StatusChip status={ticket.status} />
            </Box>
            <TextField select size="small" label="Change status" value={ticket.status}
              onChange={(e) => void changeStatus(e.target.value as TicketStatus)} fullWidth>
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{STATUS_STYLE[s].label}</MenuItem>)}
            </TextField>
            <Meta label="Created by" value={ticket.created_by} />
            <Meta label="Created" value={formatDateTime(ticket.created_at)} />
            <Meta label="Last updated" value={formatDateTime(ticket.updated_at)} />
          </Stack>
        </Paper>
      </Box>
      <AiAssistPanel ticketId={ticket.id} />
    </>
  );
}
