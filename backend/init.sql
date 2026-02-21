CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    definition JSONB NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create agents table for storing agent information

CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'server',
    hostname VARCHAR(255),
    platform VARCHAR(100),
    os_version VARCHAR(100),
    version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'offline',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on agent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger t
        WHERE t.tgname = 'update_agents_updated_at'
          AND t.tgrelid = 'agents'::regclass
    ) THEN
        CREATE TRIGGER update_agents_updated_at
        BEFORE UPDATE ON agents
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;


-- Sample data (optional)
-- INSERT INTO agents (agent_id, name, type, hostname, platform, status)
-- VALUES 
--     ('agent-demo-1', 'Demo Server Agent', 'server', 'srv-001.local', 'linux', 'offline'),
--     ('agent-demo-2', 'Demo Firewall Agent', 'firewall', 'fw-001.local', 'linux', 'offline');

-- Migration: Add role column to existing users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- Create logs table to store both valid and faulty logs
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    server_id VARCHAR(255),    -- Can be NULL for faulty logs
    firewall_id VARCHAR(255),  -- Can be NULL for faulty logs
    username VARCHAR(255),     -- Named 'username' to avoid reserved keyword 'user'
    action_type VARCHAR(100),
    policy_name VARCHAR(255),
    policy_rule TEXT,
    status VARCHAR(50),        -- e.g., 'SUCCESS', 'FAILED'
    ml_risk_score NUMERIC(5, 4), -- High precision for scores like 0.9987
    log_source VARCHAR(100),   -- e.g., 'blockchain', 'backend', 'EXTERNAL_ATTACK'
    blockchain_tx TEXT,
    notes TEXT
);

-- Index for high-risk filtering (Used by the Internal Agent/UI)
CREATE INDEX IF NOT EXISTS idx_logs_risk_score ON logs(ml_risk_score);

-- Index for chronological sorting in the UI
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC);

-- Index for searching by server or firewall
CREATE INDEX IF NOT EXISTS idx_logs_server_fw ON logs(server_id, firewall_id);