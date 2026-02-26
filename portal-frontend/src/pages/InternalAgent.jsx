import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Shield as ShieldIcon,
  Assessment,
  Terminal,
  CloudUpload,
} from "@mui/icons-material";
import axios from "axios";
import { useSecurity } from "../context/SecurityContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
    timestamp: new Date(Date.now() - Math.random() * 1000).toISOString(),
    status: "FAILED",
    log_source: "EXTERNAL_ATTACK",
  }));
}

const AgentPage = () => {
  const [logs, setLogs] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [analyzingReport, setAnalyzingReport] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUnderAttack, breachReport, setBreachReport, isAnalyzing, setIsAnalyzing } = useSecurity();

  const handleSimulateBreach = () => {
    setSimulating(true);
    setTimeout(() => {
      const newLogs = generateMockLogs(100);
      setLogs(newLogs);
      setUnderAttack(true);
      setSnackbar({
        open: true,
        message: "🚨 Attack simulated — 100 threat events generated from live telemetry stream.",
        severity: "warning",
      });
      setSimulating(false);
    }, 800);
  };

  const handleGenerateReport = async () => {
    setAnalyzingReport(true);
    setIsAnalyzing(true);
    try {
      const { data } = await axios.post(`${API}/api/breach/analyze`, {
        csvFile: "faulty_logs_100.csv",
      });
      if (data.success && data.report) {
        setBreachReport(data.report);
        setSnackbar({
          open: true,
          message: `✅ AI Report generated — Risk Score: ${data.report.riskScore}/10. ${data.report.meta.totalLogs} events analyzed.`,
          severity: "success",
        });
      }
    } catch (err) {
      console.error("Breach analysis error:", err);
      setSnackbar({
        open: true,
        message: "❌ Failed to generate report. Ensure the backend is running on port 8080.",
        severity: "error",
      });
    } finally {
      setAnalyzingReport(false);
      setIsAnalyzing(false);
    }
  };

  const handleViewReport = () => {
    navigate("/breach-report");
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
    setBreachReport(null);
    setSnackbar({
      open: true,
      message: "✅ Simulation cleared. App restored to normal.",
      severity: "success",
    });
  };

  const highRiskCount = logs.filter((l) => l.ml_risk_score >= 0.9).length;
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a1f3a 100%)"
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
            background: isDark
              ? "rgba(22, 27, 34, 0.90)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            border: `1px solid ${isDark
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
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                <Terminal sx={{ mr: 1, verticalAlign: "middle" }} />
                Network Monitor / Internal Agent
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                }}
              >
                Real-time threat log analysis & AI-powered breach detection
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
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
                sx={{ textTransform: "none" }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleSimulateBreach}
                disabled={simulating}
                startIcon={simulating ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 2px 12px rgba(211,47,47,0.4)",
                  borderRadius: 2,
                }}
              >
                {simulating ? "Simulating…" : "Simulate Breach"}
              </Button>
              {logs.length > 0 && (
                <>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleGenerateReport}
                    disabled={analyzingReport}
                    startIcon={
                      analyzingReport ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Assessment />
                      )
                    }
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      boxShadow: "0 2px 12px rgba(237,108,2,0.4)",
                    }}
                  >
                    {analyzingReport
                      ? "Analyzing CSV Data…"
                      : breachReport
                        ? "Re-Analyze"
                        : "Generate AI Report"}
                  </Button>
                  {breachReport && (
                    <Button
                      variant="contained"
                      color="info"
                      onClick={handleViewReport}
                      startIcon={<Assessment />}
                      sx={{
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      View AI Report
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={handleClearSimulation}
                    startIcon={<ShieldIcon />}
                    sx={{ fontWeight: 600, textTransform: "none", borderRadius: 2 }}
                  >
                    Clear
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* AI Report Summary Card (visible after analysis) */}
          {breachReport && (
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 3,
                borderLeft: "4px solid",
                borderLeftColor:
                  breachReport.riskScore >= 8
                    ? "error.main"
                    : breachReport.riskScore >= 5
                      ? "warning.main"
                      : "success.main",
                background: isDark
                  ? "rgba(211,47,47,0.06)"
                  : "rgba(211,47,47,0.03)",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                },
              }}
              onClick={handleViewReport}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background:
                      breachReport.riskScore >= 8
                        ? "linear-gradient(135deg, #d32f2f, #ff1744)"
                        : breachReport.riskScore >= 5
                          ? "linear-gradient(135deg, #ed6c02, #ff9100)"
                          : "linear-gradient(135deg, #2e7d32, #00c853)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                    flexShrink: 0,
                  }}
                >
                  {breachReport.riskScore}
                </Box>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    🛡️ AI Incident Report Ready — Risk Level: {breachReport.riskScore}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {breachReport.meta.totalLogs} events analyzed · {breachReport.meta.highRiskEvents} critical · {breachReport.meta.attackTypes.join(", ")} · Click to view full report
                  </Typography>
                </Box>
                <Chip
                  label="View Report →"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Paper>
          )}

          {/* Analyzing progress bar */}
          {analyzingReport && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                🔍 Analyzing breach telemetry from faulty_logs_100.csv…
              </Typography>
              <LinearProgress
                sx={{
                  borderRadius: 2,
                  height: 6,
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #d32f2f, #ff9100, #ffeb3b)",
                  },
                }}
              />
            </Box>
          )}

          <TableContainer
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: `1px solid ${isDark
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(25, 118, 210, 0.15)"
                }`,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {["Source", "Firewall", "User", "Risk Score", "Action", "Status"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: 700,
                          background: isDark
                            ? "rgba(74, 144, 226, 0.12)"
                            : "rgba(25, 118, 210, 0.08)",
                        }}
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{
                        py: 8,
                        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                      }}
                    >
                      <Terminal sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        No logs yet. Click &quot;Simulate Breach&quot; to ingest threat telemetry.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        This will load 100 anomalous events from the CSV-based event stream.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, i) => (
                    <TableRow
                      key={log.id ?? i}
                      sx={{
                        bgcolor:
                          log.ml_risk_score >= 0.95
                            ? isDark
                              ? "rgba(211,47,47,0.15)"
                              : "rgba(211,47,47,0.08)"
                            : log.ml_risk_score >= 0.9
                              ? isDark
                                ? "rgba(211,47,47,0.08)"
                                : "rgba(211,47,47,0.03)"
                              : "transparent",
                        "&:hover": {
                          bgcolor: isDark
                            ? "rgba(74,144,226,0.08)"
                            : "rgba(25,118,210,0.04)",
                        },
                      }}
                    >
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                        {log.server_id ? (
                          log.server_id
                        ) : (
                          <Typography
                            component="span"
                            sx={{
                              color: "error.main",
                              textDecoration: "underline dotted",
                              fontWeight: 600,
                            }}
                          >
                            [MISSING]
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                        {log.firewall_id || (
                          <Typography
                            component="span"
                            sx={{ color: "warning.main", fontWeight: 600 }}
                          >
                            [NONE]
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.username ? (
                          <Chip
                            label={log.username}
                            size="small"
                            color={log.username === "hacker" ? "error" : log.username === "root" ? "warning" : "default"}
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Chip
                            label="ANONYMOUS"
                            size="small"
                            color="error"
                            variant="filled"
                            sx={{ fontWeight: 700 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`ML Risk: ${(log.ml_risk_score * 100).toFixed(1)}%`}>
                          <Chip
                            label={`${((log.ml_risk_score ?? 0) * 100).toFixed(1)}%`}
                            size="small"
                            color={log.ml_risk_score >= 0.95 ? "error" : log.ml_risk_score >= 0.9 ? "warning" : "success"}
                            sx={{ fontWeight: 700, minWidth: 56 }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color:
                            log.action_type === "CONFIG_WIPE"
                              ? "error.main"
                              : log.action_type === "BRUTE_FORCE"
                                ? "warning.main"
                                : "text.primary",
                        }}
                      >
                        {log.action_type || "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status || "FAILED"}
                          size="small"
                          color={log.status === "FAILED" ? "error" : "success"}
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                        />
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
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgentPage;
