import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputAdornment, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TextField, Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api/client";
import PageHeader from "../components/PageHeader";
import StatusChip, { STATUS_STYLE } from "../components/StatusChip";
import { useAuth } from "../context/AuthContext";
import type { Ticket, TicketStatus } from "../types";
import { formatDate } from "../utils";

type Filter = "ALL" | TicketStatus;

export default function TicketList() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setTickets(await api.listTickets());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { ALL: tickets.length, OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 };
    tickets.forEach((t) => { c[t.status] += 1; });
    return c;
  }, [tickets]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter(
      (t) =>
        (filter === "ALL" || t.status === filter) &&
        (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) ||
          String(t.id) === q || t.created_by.toLowerCase().includes(q))
    );
  }, [tickets, filter, search]);

  const pageRows = visible.slice(page * rows, page * rows + rows);

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.deleteTicket(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete ticket");
      setToDelete(null);
    }
  };

  const tiles: { key: Filter; label: string; color: string }[] = [
    { key: "ALL", label: "All tickets", color: "#14232E" },
    { key: "OPEN", label: "Open", color: STATUS_STYLE.OPEN.color },
    { key: "IN_PROGRESS", label: "In progress", color: STATUS_STYLE.IN_PROGRESS.color },
    { key: "CLOSED", label: "Closed", color: STATUS_STYLE.CLOSED.color },
  ];

  return (
    <>
      <PageHeader
        title={isAdmin ? "All tickets" : "My tickets"}
        subtitle={isAdmin ? "Every ticket raised by every user." : "Tickets you have raised."}
        action={<Button variant="contained" component={RouterLink} to="/tickets/new">New ticket</Button>}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        {tiles.map((t) => (
          <Paper
            key={t.key} component="button" type="button" onClick={() => { setFilter(t.key); setPage(0); }}
            sx={{
              textAlign: "left", p: 2, cursor: "pointer", font: "inherit", color: "inherit", bgcolor: "background.paper",
              borderLeft: `4px solid ${t.color}`,
              outline: filter === t.key ? `2px solid ${t.color}` : "none", outlineOffset: -1,
              "&:hover": { bgcolor: "#FAFBFC" },
            }}
          >
            <Typography sx={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>{counts[t.key]}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14, fontWeight: 600 }}>{t.label}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper>
        <Box sx={{ p: 2 }}>
          <TextField
            size="small" fullWidth placeholder="Search by title, description, ID or creator"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start">Search</InputAdornment> }}
          />
        </Box>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer>
              <Table size="medium" sx={{ minWidth: 640 }}>
                <TableHead>
                  <TableRow>
                    <TableCell width={70}>ID</TableCell>
                    <TableCell>Title</TableCell>
                    {isAdmin && <TableCell>Created by</TableCell>}
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 6 : 5} align="center" sx={{ py: 7 }}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {tickets.length === 0 ? "No tickets yet" : "No tickets match your filters"}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: tickets.length === 0 ? 2 : 0 }}>
                          {tickets.length === 0 ? "Create your first ticket to get started." : "Try a different search or status."}
                        </Typography>
                        {tickets.length === 0 && (
                          <Button variant="contained" component={RouterLink} to="/tickets/new">New ticket</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                  {pageRows.map((t) => (
                    <TableRow key={t.id} hover>
                      <TableCell sx={{ color: "text.secondary", fontWeight: 700 }}>#{t.id}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Link component={RouterLink} to={`/tickets/${t.id}`} underline="hover" color="inherit" sx={{ fontWeight: 700 }}>
                          {t.title}
                        </Link>
                        <Typography noWrap color="text.secondary" sx={{ fontSize: 13 }}>{t.description}</Typography>
                      </TableCell>
                      {isAdmin && <TableCell>{t.created_by}</TableCell>}
                      <TableCell><StatusChip status={t.status} /></TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(t.created_at)}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <Button size="small" component={RouterLink} to={`/tickets/${t.id}`}>View</Button>
                        <Button size="small" component={RouterLink} to={`/tickets/${t.id}/edit`}>Edit</Button>
                        <Button size="small" color="error" onClick={() => setToDelete(t)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div" count={visible.length} page={page} rowsPerPage={rows}
              rowsPerPageOptions={[5, 10, 25]}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={(e) => { setRows(Number(e.target.value)); setPage(0); }}
            />
          </>
        )}
      </Paper>

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete this ticket?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ticket #{toDelete?.id} "{toDelete?.title}" will be deleted permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Delete ticket</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
