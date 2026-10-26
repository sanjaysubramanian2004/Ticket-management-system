import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap" sx={{ mb: 3 }}>
      <Box>
        <Typography variant="h5">{title}</Typography>
        {subtitle && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
      </Box>
      {action}
    </Stack>
  );
}
