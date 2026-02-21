// src/components/SecurityAlertBanner.jsx
import React from "react";
import { Alert, Box, Button } from "@mui/material";
import { useSecurity } from "../context/SecurityContext";

export default function SecurityAlertBanner() {
  const { isUnderAttack, setUnderAttack } = useSecurity();

  if (!isUnderAttack) return null;

  const handleResolve = () => {
    setUnderAttack(false);
  };

  return (
    <Box sx={{ width: "100%", position: "sticky", top: 64, zIndex: 1100 }}>
      <Alert
        severity="error"
        variant="filled"
        action={
          <Button color="inherit" size="small" onClick={handleResolve} sx={{ fontWeight: 600 }}>
            Resolve breach
          </Button>
        }
        sx={{
          borderRadius: 0,
          fontWeight: "bold",
          backgroundColor: "#d32f2f",
          animation: "pulse 2s infinite"
        }}
      >
        🚨 CRITICAL SYSTEM LOCKDOWN: Internal Agent has detected a breach. All policy changes are being automatically rolled back.
      </Alert>
      <style>
        {`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }`}
      </style>
    </Box>
  );
}