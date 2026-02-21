// routes/log.js – load faulty logs from CSV
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

let isSystemUnderAttack = false;

// Path to CSV relative to backend root (or use absolute path)
const FAULTY_LOGS_CSV = path.join(__dirname, "../../faulty_logs_100.csv");

function parseCsvToLogs(csvText) {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    const logs = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        const row = {};
        headers.forEach((h, idx) => { row[h] = values[idx]?.trim() ?? null; });
        logs.push(row);
    }
    return logs;
}

async function loadFaultyLogs() {
    const csvPath = process.env.FAULTY_LOGS_CSV || FAULTY_LOGS_CSV;
    const csvText = fs.readFileSync(csvPath, "utf-8");
    return parseCsvToLogs(csvText);
}

// Export router for integration with app
const express = require("express");
const router = express.Router();

// GET /api/logs – fetch logs from DB (for Internal Agent / threat monitoring UI)
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, timestamp, server_id, firewall_id, username, action_type, policy_name, policy_rule, status, ml_risk_score, log_source, blockchain_tx, notes
             FROM logs ORDER BY timestamp DESC LIMIT 500`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/simulate-attack-from-csv", async (req, res) => {
    isSystemUnderAttack = true;
    const faultyLogs = await loadFaultyLogs();

    const query = `INSERT INTO logs (timestamp, server_id, firewall_id, username, action_type, policy_name, policy_rule, status, ml_risk_score, log_source, blockchain_tx, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

    for (const log of faultyLogs) {
        await pool.query(query, [
            log.timestamp || null,
            log.server_id || null,
            log.firewall_id || null,
            log.user || null,
            log.action_type || null,
            log.policy_name || null,
            log.policy_rule || null,
            log.status || null,
            log.ml_risk_score || null,
            log.log_source || null,
            log.blockchain_tx || null,
            log.notes || null
        ]);
    }

    res.json({ message: `Attack simulated. ${faultyLogs.length} logs generated.`, threatLevel: "CRITICAL" });
});

module.exports = { router, loadFaultyLogs, isSystemUnderAttack: () => isSystemUnderAttack };