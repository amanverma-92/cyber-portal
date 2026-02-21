// src/components/PolicyForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Alert } from "@mui/material";
import { addLog } from "../blockchain"; // blockchain logger

const ROLLBACK_MSG = "🛡️ Internal Agent: Security breach detected. Policy addition has been automatically rolled back to maintain system integrity.";

export default function PolicyForm({ onPolicyAdded, onPolicyResult, isUnderAttack }) {
  const [name, setName] = useState("");
  const [rule, setRule] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // UI-only demo: when under attack, simulate rollback without API call
    if (isUnderAttack) {
      onPolicyResult?.({ rollback: true, message: ROLLBACK_MSG });
      return;
    }

    try {
      const res = await axios.post(
        "/api/policies",
        { name, definition: { rule } },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        try {
          await addLog("admin", `POLICY_ADDED: ${name}`);
          setSuccess("Policy added successfully and logged on blockchain!");
        } catch (bcError) {
          console.error("Blockchain log failed:", bcError);
          setError("Policy added, but blockchain log failed!");
        }
        setName("");
        setRule("");
        onPolicyAdded?.();
        onPolicyResult?.({ rollback: false });
      } else {
        throw new Error(`Unexpected response: ${res.status}`);
      }
    } catch (err) {
      const rollback = err.response?.data?.rollback;
      if (rollback) {
        onPolicyResult?.({ rollback: true, message: err.response?.data?.message || ROLLBACK_MSG });
      } else {
        setError("Failed to add policy.");
      }
    }
  };

  // 🔐 Only admins can see form
  if (localStorage.getItem("role") !== "admin") {
    return <Alert severity="warning">You do not have permission to add policies.</Alert>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="Policy Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Rule (e.g., deny port 22)"
        fullWidth
        margin="normal"
        value={rule}
        onChange={(e) => setRule(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Add Policy
      </Button>
    </Box>
  );
}
