import { useState } from "react";
import { AppBar, Avatar, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Stack, Toolbar, Typography } from "@mui/material";
import { Outlet, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BRAND, INK } from "../theme";

const WIDTH = 252;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN";

  const items = [
    { to: "/", label: isAdmin ? "All tickets" : "My tickets", active: pathname === "/" || /^\/tickets\/\d+/.test(pathname) },
    { to: "/tickets/new", label: "New ticket", active: pathname === "/tickets/new" },
    ...(isAdmin ? [{ to: "/users", label: "Users", active: pathname === "/users" }] : []),
  ];

  const initials = (user?.name ?? "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Box sx={{ height: "100%", bgcolor: INK, color: "#fff", display: "flex", flexDirection: "column", p: 2 }}>
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ px: 1, py: 1.5, mb: 2 }}>
        <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: BRAND, display: "grid", placeItems: "center", fontWeight: 800 }}>H</Box>
        <Typography variant="h6" sx={{ letterSpacing: "-0.01em" }}>Helpdesk</Typography>
      </Stack>
      <List disablePadding sx={{ flexGrow: 1 }}>
        {items.map((it) => (
          <ListItemButton
            key={it.to} component={RouterLink} to={it.to} onClick={onNavigate}
            sx={{
              borderRadius: 2, mb: 0.5, color: it.active ? "#fff" : "#A9B7C2",
              bgcolor: it.active ? "rgba(255,255,255,0.10)" : "transparent",
              "&:hover": { bgcolor: "rgba(255,255,255,0.07)" },
            }}
          >
            <ListItemText primary={it.label} primaryTypographyProps={{ fontWeight: 700, fontSize: 15 }} />
          </ListItemButton>
        ))}
      </List>
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ p: 1.25, borderRadius: 2, bgcolor: "rgba(255,255,255,0.06)" }}>
        <Avatar sx={{ bgcolor: BRAND, width: 36, height: 36, fontSize: 14, fontWeight: 800 }}>{initials}</Avatar>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: 14 }}>{user?.name}</Typography>
          <Typography noWrap sx={{ fontSize: 12, color: "#A9B7C2" }}>{isAdmin ? "Administrator" : "User"}</Typography>
        </Box>
      </Stack>
      <Button
        fullWidth variant="outlined"
        sx={{ mt: 1.5, color: "#fff", borderColor: "rgba(255,255,255,0.3)", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.06)" } }}
        onClick={() => { logout(); navigate("/login"); }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box component="nav" sx={{ width: { md: WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: WIDTH, border: 0 } }}>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </Drawer>
        <Drawer variant="permanent" open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: WIDTH, border: 0 } }}>
          <SidebarContent />
        </Drawer>
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar position="sticky" color="inherit" sx={{ display: { md: "none" }, borderBottom: "1px solid #E2E7EB", boxShadow: "none" }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setOpen(true)} aria-label="Open menu" sx={{ mr: 1, fontSize: 14, fontWeight: 700, borderRadius: 2 }}>
              Menu
            </IconButton>
            <Typography variant="h6">Helpdesk</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
