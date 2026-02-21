import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { Refresh as RefreshIcon, Warning as WarningIcon, Shield as ShieldIcon } from "@mui/icons-material";
import { useSecurity } from "../context/SecurityContext";

// Mock log generator (no backend) – matches faulty_logs structure
const MOCK_ACTIONS = ["BRUTE_FORCE", "UNAUTHORIZED_LOGIN", "CONFIG_WIPE", "MALICIOUS_ACCESS"];
const MOCK_USERS = ["root", "hacker", null];
const MOCK_SOURCES = ["srv-001", "srv-999", null];
const MOCK_FW = ["fw-001", "fw-500", null];

function generateMockLogs(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${Date.now()}-${i}`,
    server_id: MOCK_SOURCES[i % MOCK_SOURCES.length],
    firewall_id: MOCK_FW[(i + 1) % MOCK_FW.length],
    username: MOCK_USERS[i % MOCK_USERS.length],
    action_type: MOCK_ACTIONS[i % MOCK_ACTIONS.length],
    ml_risk_score: 0.9 + Math.random() * 0.1,
  }));
}

const AgentPage = () => {
  const [logs, setLogs] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const theme = useTheme();
  const { setUnderAttack } = useSecurity();

  const handleSimulateBreach = () => {
    setSimulating(true);
    setTimeout(() => {
      const newLogs = generateMockLogs(100);
      setLogs(newLogs);
      setUnderAttack(true);
      setSnackbar({
        open: true,
        message: "🚨 Attack simulated.",
        severity: "warning",
      });
      setSimulating(false);
    }, 800);
  };

  const handleRefresh = () => {
    if (logs.length > 0) {
      setLogs([...logs]);
      setSnackbar({ open: true, message: "Logs refreshed", severity: "info" });
    }
  };

  const handleClearSimulation = () => {
    setLogs([]);
    setUnderAttack(false);
    setSnackbar({
      open: true,
      message: "✅ Simulation cleared. App restored to normal.",
      severity: "success",
    });
  };

  const highRiskCount = logs.filter((l) => l.ml_risk_score >= 0.9).length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        backgroundAttachment: "fixed",
        py: 6,
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background:
              theme.palette.mode === "dark"
                ? "rgba(26, 31, 58, 0.85)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(74, 144, 226, 0.2)"
                : "rgba(25, 118, 210, 0.2)"
            }`,
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Network Monitor / Internal Agent
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(0,0,0,0.6)",
                }}
              >
                View threat logs and simulate breach for demo
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {highRiskCount > 0 && (
                <Chip
                  icon={<WarningIcon />}
                  label={`${highRiskCount} high-risk`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleSimulateBreach}
                disabled={simulating}
                startIcon={simulating ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 2px 8px rgba(211,47,47,0.4)",
                }}
              >
                {simulating ? "Simulating…" : "Simulate Breach"}
              </Button>
              {logs.length > 0 && (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={handleClearSimulation}
                  startIcon={<ShieldIcon />}
                  sx={{ fontWeight: 600, textTransform: "none" }}
                >
                  Clear simulation
                </Button>
              )}
            </Box>
          </Box>

          <TableContainer
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(25, 118, 210, 0.15)"
              }`,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(74, 144, 226, 0.12)"
                          : "rgba(25, 118, 210, 0.08)",
                    }}
                  >
                    Source
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(74, 144, 226, 0.12)"
                          : "rgba(25, 118, 210, 0.08)",
                    }}
                  >
                    User
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(74, 144, 226, 0.12)"
                          : "rgba(25, 118, 210, 0.08)",
                    }}
                  >
                    Risk Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(74, 144, 226, 0.12)"
                          : "rgba(25, 118, 210, 0.08)",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{
                        py: 6,
                        color:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.5)",
                      }}
                    >
                      No logs yet. Click &quot;Simulate Breach&quot; to add sample
                      threat logs.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, i) => (
                    <TableRow
                      key={log.id ?? i}
                      sx={{
                        bgcolor:
                          log.ml_risk_score >= 0.9
                            ? theme.palette.mode === "dark"
                              ? "rgba(211,47,47,0.12)"
                              : "rgba(211,47,47,0.06)"
                            : "transparent",
                      }}
                    >
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                        {log.server_id || log.firewall_id ? (
                          log.server_id || log.firewall_id
                        ) : (
                          <Typography
                            component="span"
                            sx={{ color: "error.main", textDecoration: "underline dotted" }}
                          >
                            [MISSING_ID]
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.username ? (
                          log.username
                        ) : (
                          <Typography
                            component="span"
                            sx={{ color: "warning.main", fontWeight: 700 }}
                          >
                            ANONYMOUS
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${((log.ml_risk_score ?? 0) * 100).toFixed(1)}%`}
                          size="small"
                          color={log.ml_risk_score >= 0.9 ? "error" : "success"}
                          sx={{ fontWeight: 600, minWidth: 56 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.875rem" }}>
                        {log.action_type || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgentPage;
