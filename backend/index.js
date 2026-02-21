// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool, initDb } = require("./db");
const authRoutes = require("./routes/auth");
const policyRoutes = require("./routes/policies");
const agentRoutes = require('./routes/agents');
const { router: logRoutes } = require('./routes/log');
const { router: systemRoutes } = require('./routes/system');

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Initialize DB schema if enabled
initDb();

// Routes - more specific mounts first (so /api/logs is matched before /api)
app.use('/api/agents', agentRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/system", systemRoutes);
app.use("/api", authRoutes);
app.use("/api", policyRoutes);

// Debug: Log all registered routes
console.log('📋 Registered routes:');
console.log('  POST /api/register (auth)');
console.log('  POST /api/login (auth)');
console.log('  POST /api/policies (policies)');
console.log('  GET /api/policies (policies)');
console.log('  POST /api/agents/register (agents)');
console.log('  POST /api/agents/heartbeat (agents)');
console.log('  POST /api/agents/metrics (agents)');
console.log('  GET /api/agents (agents)');

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ status: "db_error" });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Start server
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

