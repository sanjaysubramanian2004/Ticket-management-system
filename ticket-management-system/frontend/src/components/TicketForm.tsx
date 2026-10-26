import { useState, type FormEvent } from "react";
import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { STATUSES, type TicketInput, type TicketStatus } from "../types";

interface Props {
  initial?: TicketInput;
  isEdit?: boolean;
  submitLabel: string;
  onSubmit: (data: TicketInput) => Promise<void>;
  onCancel: () => void;
}

export default function TicketForm({ initial, isEdit = false, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<TicketStatus>(initial?.status ?? "OPEN");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Title is required";
    else if (title.length > 200) next.title = "Title must be 200 characters or fewer";
    if (!description.trim()) next.description = "Description is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    setServerError("");
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status: isEdit ? status : undefined });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title} helperText={errors.title} required fullWidth />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description} helperText={errors.description} required fullWidth multiline minRows={4} />
        <TextField select label="Status" value={isEdit ? status : "OPEN"}
          onChange={(e) => setStatus(e.target.value as TicketStatus)} disabled={!isEdit}
          helperText={isEdit ? undefined : "New tickets always start as OPEN"} fullWidth>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
          <Button onClick={onCancel} disabled={saving}>Cancel</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
