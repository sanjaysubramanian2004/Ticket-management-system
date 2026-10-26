import { useEffect, useState } from "react";
import { Alert, Avatar, Box, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { api } from "../api/client";
import PageHeader from "../components/PageHeader";
import { BRAND } from "../theme";
import type { User } from "../types";
import { formatDate } from "../utils";

export default function Users() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listUsers().then(setUsers).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <PageHeader title="Users" subtitle={users ? `${users.length} registered accounts` : undefined} />
      {error && <Alert severity="error">{error}</Alert>}
      {!users && !error && <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>}
      {users && (
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 800, bgcolor: u.role === "ADMIN" ? BRAND : "#8A99A5" }}>
                          {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontWeight: 700 }}>{u.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role === "ADMIN" ? "Administrator" : "User"}</TableCell>
                    <TableCell>{formatDate(u.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}
