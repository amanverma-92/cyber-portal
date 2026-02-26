// src/components/SecurityAlertBanner.jsx
import React, { useState } from "react";
import { Alert, Box, Button, CircularProgress, Chip } from "@mui/material";
import { Assessment, Shield } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSecurity } from "../context/SecurityContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function SecurityAlertBanner() {
  const {
    isUnderAttack,
    setUnderAttack,
    breachReport,
    setBreachReport,
    isAnalyzing,
    setIsAnalyzing,
  } = useSecurity();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (!isUnderAttack) return null;

  const handleViewReport = async () => {
    if (breachReport) {
      navigate("/breach-report");
      return;
    }
    // Trigger real-time analysis
    setIsAnalyzing(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API}/api/breach/analyze`, {
        csvFile: "faulty_logs_100.csv",
      });
      if (data.success && data.report) {
        setBreachReport(data.report);
        navigate("/breach-report");
      }
    } catch (err) {
      console.error("Breach analysis failed:", err);
      setError("Analysis failed. Is the backend running?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResolve = () => {
    setUnderAttack(false);
    setBreachReport(null);
  };

  return (
    <Box sx={{ width: "100%", position: "sticky", top: 64, zIndex: 1100 }}>
      <Alert
        severity="error"
        variant="filled"
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleViewReport}
              startIcon={
                isAnalyzing ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <Assessment />
                )
              }
              disabled={isAnalyzing}
              sx={{
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 2,
                px: 1.5,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderColor: "#fff",
                },
              }}
            >
              {isAnalyzing
                ? "Analyzing…"
                : breachReport
                  ? "View AI Report"
                  : "Generate AI Report"}
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleResolve}
              startIcon={<Shield />}
              sx={{ fontWeight: 600, textTransform: "none" }}
            >
              Resolve
            </Button>
          </Box>
        }
        sx={{
          borderRadius: 0,
          fontWeight: "bold",
          backgroundColor: "#d32f2f",
          animation: "pulse 2s infinite",
        }}
      >
        🚨 CRITICAL SYSTEM LOCKDOWN: Internal Agent has detected a breach. All
        policy changes are being automatically rolled back.
        {breachReport && (
          <Chip
            label={`Risk: ${breachReport.riskScore}/10`}
            size="small"
            sx={{
              ml: 1.5,
              fontWeight: 700,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          />
        )}
        {error && (
          <Chip
            label={error}
            size="small"
            sx={{
              ml: 1.5,
              fontWeight: 600,
              bgcolor: "rgba(0,0,0,0.3)",
              color: "#ffcdd2",
            }}
          />
        )}
      </Alert>
      <style>
        {`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }`}
      </style>
    </Box>
  );
}