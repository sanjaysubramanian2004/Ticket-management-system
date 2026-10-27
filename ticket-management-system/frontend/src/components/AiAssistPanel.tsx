import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { api, type AiAssist } from "../api/client";

const PRIORITY_COLOR = { LOW: "success", MEDIUM: "warning", HIGH: "error" } as const;

export default function AiAssistPanel({ ticketId }: { ticketId: number }) {
  const [result, setResult] = useState<AiAssist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setResult(null);
    setError("");
  }, [ticketId]);

  const run = async () => {
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      setResult(await api.aiAssist(ticketId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.suggested_reply);
      setCopied(true);
    } catch {
      setError("Could not copy to clipboard");
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
        <Box>
          <Typography sx={{ fontWeight: 800 }}>AI assistant</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            Summarise this ticket, rate its priority and draft a reply (powered by Groq).
          </Typography>
        </Box>
        <Button variant="contained" onClick={run} disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}>
          {loading ? "Thinking..." : result ? "Regenerate" : "Generate insights"}
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {result && (
        <Stack spacing={2.5} sx={{ mt: 2.5 }}>
          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>Summary</Typography>
            <Typography>{result.summary}</Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>Suggested priority</Typography>
            <Chip size="small" label={result.priority} color={PRIORITY_COLOR[result.priority]} />
          </Box>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 600 }}>Suggested reply</Typography>
              <Button size="small" onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
            </Stack>
            <Box sx={{ mt: 0.5, p: 2, bgcolor: "#F8FAFB", border: "1px solid #E2E7EB", borderRadius: 2, whiteSpace: "pre-wrap" }}>
              {result.suggested_reply}
            </Box>
          </Box>
        </Stack>
      )}
    </Paper>
  );
}
