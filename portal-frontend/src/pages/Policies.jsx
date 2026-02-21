import React, { useEffect, useState } from "react";
import axios from "axios";
import PolicyForm from "../components/PolicyForm";
import PolicyTable from "../components/PolicyTable";
import { Container, Typography, Paper, Button, Box, useTheme, Alert, Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSecurity } from "../context/SecurityContext";

export default function Policies() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isUnderAttack } = useSecurity();

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "view";

  // --- DEMO STATES ---
  const [feedback, setFeedback] = useState({ open: false, message: "", severity: "info" });

  // Hardcoded dummy policies
 // Hardcoded dummy policies
const dummyPolicies = [
{
id: "dummy-1",
policy_id: "dummy-1",
name: "Block SSH Access",
status: "active",
definition: {
rule: "Block RDP Access"
},
created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
},
{
id: "dummy-2",
policy_id: "dummy-2",
name: "Block HTTP Traffic",
status: "active",
definition: {
rule: "BLock HTTP requests"
},
created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
},
{
id: "dummy-3",
policy_id: "dummy-3",
name: "Allow HTTPS Only",
status: "active",
definition: {
rule: "Allow HTTPS Only"
},
created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
},
{
id: "dummy-4",
policy_id: "dummy-4",
name: "Block FTP Ports",
status: "pending",
definition: {
rule: "Prevent FTP Access"
},
created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
},
{
id: "dummy-5",
policy_id: "dummy-5",
name: "Rate Limit ICMP",
status: "active",
definition: {
rule: "Limit ICMP Traffic"
},
created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
},
{
id: "dummy-6",
policy_id: "dummy-6",
name: "Block Telnet",
status: "active",
definition: {
rule: "Block Telnet Access"
},
created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
},
{
id: "dummy-7",
policy_id: "dummy-7",
name: "Allow DNS Queries",
status: "active",
definition: {
rule: "Allow DNS Queries"
},
created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
},
{
id: "dummy-8",
policy_id: "dummy-8",
name: "Block RDP Access",
status: "active",
definition: {
rule: "Block RDP Access"
},
created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
isDummy: true
}
];

  const [policies, setPolicies] = useState(dummyPolicies);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/api/policies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const allPolicies = [...dummyPolicies, ...(res.data || [])];
      setPolicies(allPolicies);
    } catch (err) {
      setPolicies(dummyPolicies);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // 2. Handle Policy Addition Result (Success vs Rollback)
  const handlePolicyAction = (response) => {
    if (response.rollback) {
      setFeedback({
        open: true,
        message: response.message, // "🛡️ Internal Agent: Security breach detected. Policy rolled back."
        severity: "error"
      });
    } else {
      setFeedback({
        open: true,
        message: "✅ Policy added successfully",
        severity: "success"
      });
      fetchPolicies();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        backgroundAttachment: "fixed",
        py: 6,
        position: "relative",
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        
        {/* 3. THREAT BANNER (Demo Notification) */}
        {isUnderAttack && (
          <Alert 
            severity="error" 
            variant="filled" 
            sx={{ mb: 3, fontWeight: 'bold', animation: 'pulse 2s infinite' }}
          >
            🚨 SYSTEM LOCKDOWN: Internal Agent is monitoring network. Policy changes are being automatically rolled back.
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 5,
            background: theme.palette.mode === "dark" ? "rgba(26, 31, 58, 0.85)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(74, 144, 226, 0.2)" : "rgba(25, 118, 210, 0.2)"}`,
            borderRadius: 4,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {mode === "add" ? "➕ Add New Policy" : "📋 Policies"}
          </Typography>

          {mode === "add" ? (
            <PolicyForm onPolicyResult={handlePolicyAction} isUnderAttack={isUnderAttack} />
          ) : (
            <PolicyTable policies={policies} />
          )}

          <Button
            variant="outlined"
            sx={{ mt: 3 }}
            onClick={() => navigate("/dashboard")}
          >
            ⬅ Back to Dashboard
          </Button>
        </Paper>
      </Container>

      {/* 4. FEEDBACK SNACKBAR (For Rollback notification) */}
      <Snackbar 
        open={feedback.open} 
        autoHideDuration={6000} 
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}