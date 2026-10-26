import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import PageHeader from "../components/PageHeader";
import TicketForm from "../components/TicketForm";
import type { Ticket } from "../types";

export default function EditTicket() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!/^\d+$/.test(id)) {
      setError("Invalid ticket ID");
      return;
    }
    api.getTicket(id).then(setTicket).catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!ticket) return <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>;

  return (
    <>
      <PageHeader title={`Edit ticket #${ticket.id}`} subtitle="Update the details or change the status." />
      <Paper sx={{ p: { xs: 2, md: 3.5 }, maxWidth: 680 }}>
        <TicketForm
          isEdit
          initial={{ title: ticket.title, description: ticket.description, status: ticket.status }}
          submitLabel="Save changes"
          onSubmit={async (d) => {
            await api.updateTicket(ticket.id, d);
            navigate(`/tickets/${ticket.id}`);
          }}
          onCancel={() => navigate(`/tickets/${ticket.id}`)}
        />
      </Paper>
    </>
  );
}
