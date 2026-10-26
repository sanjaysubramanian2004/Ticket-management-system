import { createTheme } from "@mui/material";

export const INK = "#14232E";
export const BRAND = "#0E6B80";

export const theme = createTheme({
  palette: {
    primary: { main: BRAND, dark: "#0A5063" },
    text: { primary: INK, secondary: "#5B6B77" },
    background: { default: "#F3F5F7", paper: "#FFFFFF" },
    divider: "#E2E7EB",
    error: { main: "#C0392B" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", system-ui, sans-serif',
    h4: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 800, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: "1px solid #E2E7EB" } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: "#5B6B77", fontSize: 13, background: "#F8FAFB" },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined" } },
  },
});
