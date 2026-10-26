import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import PageHeader from "../components/PageHeader";
import TicketForm from "../components/TicketForm";

export default function CreateTicket() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="New ticket" subtitle="Describe the problem. It starts as Open." />
      <Paper sx={{ p: { xs: 2, md: 3.5 }, maxWidth: 680 }}>
        <TicketForm
          submitLabel="Create ticket"
          onSubmit={async (d) => {
            const t = await api.createTicket({ title: d.title, description: d.description });
            navigate(`/tickets/${t.id}`);
          }}
          onCancel={() => navigate("/")}
        />
      </Paper>
    </>
  );
}
