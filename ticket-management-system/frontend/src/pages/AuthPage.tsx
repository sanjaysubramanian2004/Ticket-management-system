import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { BRAND, INK } from "../theme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (isRegister && !name.trim()) next.name = "Name is required";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    else if (isRegister && password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setServerError("");
    try {
      if (isRegister) await api.register(name.trim(), email.trim(), password);
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" } }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between",
          bgcolor: INK, color: "#fff", p: 6,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: BRAND, display: "grid", placeItems: "center", fontWeight: 800 }}>H</Box>
          <Typography variant="h6">Helpdesk</Typography>
        </Stack>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 460 }}>
            Every request, tracked until it is closed.
          </Typography>
          <Typography sx={{ mt: 2.5, color: "#A9B7C2", maxWidth: 420, lineHeight: 1.7 }}>
            Raise a ticket, follow its status from open to closed, and keep the whole history in one place.
          </Typography>
        </Box>
        <Stack direction="row" gap={3} sx={{ color: "#A9B7C2", fontSize: 14 }}>
          <span>Open</span><span>In progress</span><span>Closed</span>
        </Stack>
      </Box>

      <Box sx={{ display: "grid", placeItems: "center", p: 3, bgcolor: "background.paper" }}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%", maxWidth: 380 }}>
          <Stack spacing={2.25}>
            <Box>
              <Typography variant="h4">{isRegister ? "Create your account" : "Welcome back"}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {isRegister ? "Register to start raising tickets." : "Sign in to manage your tickets."}
              </Typography>
            </Box>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            {isRegister && (
              <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)}
                error={!!errors.name} helperText={errors.name} fullWidth autoFocus />
            )}
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email} helperText={errors.email} fullWidth autoFocus={!isRegister} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password} helperText={errors.password} fullWidth />
            <Button type="submit" variant="contained" size="large" disabled={busy} sx={{ py: 1.4 }}>
              {busy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
            </Button>
            <Typography variant="body2" color="text.secondary">
              {isRegister ? "Already registered? " : "No account yet? "}
              <Link component={RouterLink} to={isRegister ? "/login" : "/register"} underline="hover" sx={{ fontWeight: 700 }}>
                {isRegister ? "Sign in" : "Create one"}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
