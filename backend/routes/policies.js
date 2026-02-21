const express = require("express");
const { pool } = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: "❌ Access denied. Admin role required to add policies." 
    });
  }
  next();
}

/**
 * DEMO FEATURE: Internal Agent Threat Detection
 * This helper checks if any of the 100 faulty logs (risk > 0.9) 
 * were generated in the last 10 minutes.
 */
async function checkActiveThreats() {
  const query = `
    SELECT COUNT(*) FROM logs 
    WHERE ml_risk_score >= 0.9 
    AND timestamp > NOW() - INTERVAL '10 minutes'
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count) > 0;
}

// GET /api/system-status – used by Policies, SecurityContext, SecurityAlertBanner
router.get("/system-status", authenticateToken, async (req, res) => {
  try {
    const isUnderAttack = await checkActiveThreats();
    res.json({ isUnderAttack });
  } catch (err) {
    res.status(500).json({ isUnderAttack: false, error: err.message });
  }
});

// 1. New Endpoint to trigger the "Attack" for demo purposes
router.post("/simulate-attack", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // These represent the 'faulty logs' with high risk and missing values
    const attackLogs = Array.from({ length: 100 }).map((_, i) => [
      null, // missing server_id
      'fw-999',
      'hacker_root',
      'UNAUTHORIZED_CONFIG_CHANGE',
      0.99, // high risk score
      'EXTERNAL_ATTACK',
      `Anomalous activity packet #${i}`
    ]);

    // Bulk insert into the logs table
    for (const log of attackLogs) {
      await pool.query(
        "INSERT INTO logs (server_id, firewall_id, username, action_type, ml_risk_score, log_source, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        log
      );
    }

    res.json({ success: true, message: "🚨 Attack Simulated: 100 high-risk logs generated." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Updated Add Policy Route with Rollback Logic
router.post("/policies", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, definition } = req.body;
    const created_by = req.user.username;

    // --- INTERNAL AGENT CHECK ---
    const isUnderAttack = await checkActiveThreats();

    if (isUnderAttack) {
      // Log the rollback event
      await pool.query(
        "INSERT INTO logs (username, action_type, notes, ml_risk_score, log_source) VALUES ($1, $2, $3, $4, $5)",
        [created_by, 'POLICY_ROLLBACK', `Internal Agent automatically rolled back policy: ${name}`, 1.0, 'INTERNAL_AGENT']
      );

      // Return a 403 or specific error that the UI can catch to show the "Rollback" notification
      return res.status(403).json({
        success: false,
        rollback: true,
        message: "🛡️ Internal Agent: Security breach detected. Policy addition has been automatically rolled back to maintain system integrity."
      });
    }
    // --- END INTERNAL AGENT CHECK ---

    const result = await pool.query(
      "INSERT INTO policies (name, definition, created_by) VALUES ($1, $2, $3) RETURNING *",
      [name, definition, created_by]
    );

    res.json({
      success: true,
      policy: result.rows[0],
      message: "✅ Policy added successfully"
    });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, error: "❌ Failed to add policy" });
  }
});

// Get all policies
router.get("/policies", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM policies ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "❌ Failed to fetch policies" });
  }
});

module.exports = router;