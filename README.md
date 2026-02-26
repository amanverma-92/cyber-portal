# 🛡️ Cyber Portal — AI-Powered Cybersecurity Incident Response System

A full-stack cybersecurity monitoring and incident response platform featuring **real-time breach detection**, **AI-powered report generation**, **ML-based security predictions**, **blockchain-verified policy management**, and **autonomous security agents**.

---

## 📋 Table of Contents

- [Project Synopsis](#-project-synopsis)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture Diagram](#-architecture-diagram)
- [AI Breach Analysis Engine — How It Works](#-ai-breach-analysis-engine--how-it-works)
- [Risk Score Calculation Logic](#-risk-score-calculation-logic)
- [Report Sections & Data Derivation](#-report-sections--data-derivation)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Prerequisites](#-prerequisites)
- [How to Run](#-how-to-run)
- [Usage Walkthrough](#-usage-walkthrough)
- [CSV Dataset Format](#-csv-dataset-format)
- [Screenshots / UI Flow](#-screenshots--ui-flow)
- [Security Concepts Implemented](#-security-concepts-implemented)
- [Future Scope](#-future-scope)

---

## 🎯 Project Synopsis

**Cyber Portal** is an enterprise-grade cybersecurity monitoring dashboard that simulates a real-world Security Operations Center (SOC). The system ingests security event logs (from CSV-based telemetry streams), detects anomalies using statistical analysis and pattern recognition, and automatically generates structured **AI Incident Response Reports**.

### Core Problem Solved
In modern cybersecurity, SOC analysts face alert fatigue from thousands of daily events. This portal automates the process of:
1. **Ingesting** raw security events from CSV data streams
2. **Detecting** anomalous patterns (brute force, unauthorized access, config wiping, etc.)
3. **Analyzing** the data for attack timeline reconstruction, entity correlation, and severity scoring
4. **Generating** structured incident response reports with actionable containment, recovery, and prevention recommendations
5. **Visualizing** everything in a real-time dashboard with interactive charts

### What Makes It Unique
- **Dataset-Adaptive**: Feed it *any* CSV following the log schema — the report dynamically adapts. Different datasets produce meaningfully different reports.
- **No API Dependency**: Unlike systems that call OpenAI/Claude for report generation, this uses a custom algorithmic engine that computes every metric from the data itself.
- **End-to-End Flow**: From raw CSV → anomaly detection → risk scoring → attack timeline → structured report → actionable recommendations.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login/register with bcrypt password hashing and JWT token-based sessions |
| 📊 **Dashboard** | Central hub with navigation to all portal features |
| 📋 **Policy Management** | Create, view, and manage firewall policies with blockchain verification |
| 🤖 **Agent Management** | Register, monitor, and track remote security agents with heartbeat/metrics |
| 🔍 **Internal Agent / Network Monitor** | Simulate breach events and view real-time threat log tables |
| 🧠 **AI Breach Analysis** | One-click analysis of CSV telemetry → full incident response report |
| 📈 **Security Prediction** | ML-based security risk prediction using an external ModelBit API (Radar + Line charts) |
| 🚨 **Global Alert Banner** | Sticky breach notification with inline "Generate AI Report" button |
| 🌙 **Dark/Light Mode** | Full theme toggle with consistent glassmorphism design |
| ⛓️ **Blockchain Integration** | Hardhat-based smart contracts for immutable policy audit trails |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework (functional components, hooks) |
| **Vite 7** | Build tool & dev server (HMR, fast refresh) |
| **Material UI (MUI) 7** | Component library (Paper, Table, Chip, Alert, etc.) |
| **React Router DOM 7** | Client-side routing with protected routes |
| **Chart.js + react-chartjs-2** | Security prediction visualizations (Radar, Line charts) |
| **Axios** | HTTP client for API calls |
| **jwt-decode** | Client-side JWT token parsing |
| **ethers.js** | Blockchain interaction (Ethereum smart contracts) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 20+** | JavaScript runtime |
| **Express 5** | Web server framework |
| **PostgreSQL 13+** | Relational database (users, policies, agents, logs) |
| **pg** | PostgreSQL client for Node.js |
| **bcrypt / bcryptjs** | Password hashing |
| **jsonwebtoken (JWT)** | Token-based authentication |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |

### Blockchain
| Technology | Purpose |
|---|---|
| **Hardhat** | Ethereum development environment |
| **Solidity** | Smart contract language |
| **Hardhat Ignition** | Contract deployment framework |

### AI / Analysis
| Technology | Purpose |
|---|---|
| **Custom Algorithmic Engine** | Data-grounded breach analysis |
| **ModelBit API** | External ML model for single-event security prediction |
| **CSV Parser** | Custom RFC-compliant CSV parser for log ingestion |

---

## 📁 Project Structure

```
cyber-portal/
│
├── README.md                          # This file
├── .gitignore
├── cybersecurity_logs_10k.csv         # 10,000 normal operational security logs
├── faulty_logs_100.csv                # 100 attack/breach simulation logs
│
├── backend/                           # Express.js API Server
│   ├── .env                           # Environment variables (PORT, DB, JWT)
│   ├── package.json
│   ├── index.js                       # App entry point, route registration, middleware
│   ├── db.js                          # PostgreSQL connection pool & schema init
│   ├── init.sql                       # Database schema (users, policies, agents, logs)
│   ├── ADMIN_SETUP.md                 # Admin role setup guide
│   ├── routes/
│   │   ├── auth.js                    # POST /api/register, POST /api/login
│   │   ├── policies.js                # GET/POST /api/policies (JWT protected)
│   │   ├── agents.js                  # Agent CRUD, heartbeat, metrics, logs
│   │   └── breach.js                  # 🧠 AI Breach Analysis Engine
│   └── scripts/
│       ├── add-role-column.js         # DB migration: add role column
│       ├── make-admin.js              # Script to promote user to admin
│       └── make-admin.sql             # SQL to promote user to admin
│
├── portal-frontend/                   # React + Vite Frontend
│   ├── package.json
│   ├── vite.config.js                 # Vite config with API proxy
│   ├── index.html                     # SPA entry HTML
│   └── src/
│       ├── main.jsx                   # React DOM root, BrowserRouter, ThemeProvider
│       ├── App.jsx                    # Route definitions, SecurityProvider wrapper
│       ├── api/                       # (Reserved for API utilities)
│       ├── context/
│       │   ├── ThemeContext.jsx        # Dark/Light mode context
│       │   └── SecurityContext.jsx     # Breach state: isUnderAttack, breachReport
│       ├── components/
│       │   ├── Navbar.jsx             # Top navigation bar with theme toggle
│       │   ├── SecurityAlertBanner.jsx # 🚨 Global breach alert with AI report trigger
│       │   ├── ProtectedRoute.jsx     # JWT-guarded route wrapper
│       │   ├── PolicyForm.jsx         # Policy creation form
│       │   ├── PolicyTable.jsx        # Policy list table
│       │   ├── AgentCard.jsx          # Agent overview card
│       │   └── AgentDetails.jsx       # Agent detail view with metrics
│       ├── pages/
│       │   ├── Landing.jsx            # Public landing page
│       │   ├── Login.jsx              # Login form with JWT
│       │   ├── Register.jsx           # Registration form
│       │   ├── Dashboard.jsx          # Main dashboard with navigation cards
│       │   ├── Policies.jsx           # Policy management page
│       │   ├── Agents.jsx             # Agent management page (10k logs view)
│       │   ├── InternalAgent.jsx      # 🔍 Breach simulation + AI report trigger
│       │   ├── BreachReport.jsx       # 📊 Full AI incident response report page
│       │   └── SecurityPredictionPage.jsx # ML prediction with Radar/Line charts
│       ├── contracts/                 # Frontend blockchain ABI references
│       └── blockchain.js             # Ethers.js blockchain utilities
│
└── blockchain/                        # Hardhat Smart Contract Project
    ├── package.json
    ├── hardhat.config.js
    ├── contracts/                     # Solidity smart contracts
    ├── scripts/                       # Deployment scripts
    ├── test/                          # Contract tests
    └── ignition/                      # Hardhat Ignition modules
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐  │
│  │ Dashboard │  │ Policies │  │  Agents   │  │Internal Agent │  │
│  └─────┬────┘  └─────┬────┘  └─────┬─────┘  └───────┬───────┘  │
│        │             │             │      Simulate   │          │
│        │             │             │      Breach ──► │          │
│        │             │             │                 │          │
│  ┌─────┴─────────────┴─────────────┴─────────────────┴───────┐  │
│  │              SecurityAlertBanner (Global)                  │  │
│  │    [🚨 BREACH DETECTED]  [Generate AI Report] [Resolve]   │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │                  BreachReport Page                         │  │
│  │  11 Sections: Summary → Anomalies → Timeline → Root       │  │
│  │  Cause → Entities → Vulnerabilities → Risk Score →        │  │
│  │  Containment → Recovery → Prevention → Dataset Insights   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ HTTP/REST (Axios)
                                  │
┌─────────────────────────────────▼───────────────────────────────┐
│                     EXPRESS.JS BACKEND (:8080)                   │
│                                                                  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐  │
│  │  /api/auth   │  │ /api/policies │  │   /api/agents        │  │
│  │  register    │  │ CRUD          │  │   register/heartbeat │  │
│  │  login       │  │ JWT-protected │  │   metrics/logs       │  │
│  └──────────────┘  └───────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              /api/breach/analyze  (POST)                  │   │
│  │                                                            │   │
│  │   CSV File ──► Parse ──► Statistical Analysis ──►         │   │
│  │   Risk Computing ──► Timeline Reconstruction ──►          │   │
│  │   Entity Extraction ──► Report Generation                 │   │
│  │                                                            │   │
│  │   Input: Any CSV file | JSON rows                         │   │
│  │   Output: Structured Incident Response Report             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                       │
│  ┌───────────────────────▼──────────────────────────────────┐   │
│  │              PostgreSQL Database                          │   │
│  │  Tables: users | policies | agents | logs                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              CSV Data Files (Project Root)                │   │
│  │  faulty_logs_100.csv  — Breach simulation (100 events)    │   │
│  │  cybersecurity_logs_10k.csv — Normal ops (10,000 events)  │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI Breach Analysis Engine — How It Works

The analysis engine (`backend/routes/breach.js`) is a **pure algorithmic pipeline**. 

### Pipeline Flow

```
CSV Input → Parse → 12-Stage Analysis Pipeline → Structured Report JSON

Stage 1:  Basic Counts           — Total events, failed events, failure rate
Stage 2:  Risk Score Distribution — Min, max, mean, std dev of ML risk scores
Stage 3:  Action Type Frequency   — Count each action type (BRUTE_FORCE, etc.)
Stage 4:  Timestamp Analysis      — First/last event, duration, burst density
Stage 5:  Entity Extraction       — Unique servers, firewalls, users, sources
Stage 6:  Per-User Behavior       — Actions per user, high-risk concentration
Stage 7:  Per-Server Hotspots     — Event density per server
Stage 8:  Per-Firewall Hotspots   — Event density per firewall
Stage 9:  Data Corruption Scan    — Missing/null fields, malformed entries
Stage 10: Blockchain TX Audit     — Events with/without blockchain attestation
Stage 11: Weighted Risk Scoring   — 6-factor weighted composite formula
Stage 12: Report Assembly         — All 11 sections built from computed metrics
```

### Why It's Not Hardcoded

| If you feed... | You get... |
|---|---|
| `faulty_logs_100.csv` (100 attack events) | Risk 9/10, 100% critical, 4 attack types, 0.001s burst window |
| `cybersecurity_logs_10k.csv` (10k normal ops) | Completely different risk score, different entities, different timeline |
| **Any unknown CSV** with same schema | Fully adapted report with data-specific conclusions |

The engine reads column values like `server_id`, `action_type`, `ml_risk_score`, `status`, `timestamp`, etc. and **computes all statistics at runtime**. If the CSV has different server names, different action types, different timestamps — the report reflects exactly those.

---

## 📐 Risk Score Calculation Logic

The risk score (0–10) is **not arbitrary**. It uses a weighted formula with 6 data-derived factors:

```
Risk Score = Σ (Factor × Weight)

┌─────────────────────────┬────────┬──────────────────────────────────────┐
│ Factor                  │ Weight │ How It's Computed                    │
├─────────────────────────┼────────┼──────────────────────────────────────┤
│ Critical Event Density  │  0.30  │ (events with ML risk ≥ 0.9) / total │
│ Average ML Risk Score   │  0.20  │ Mean of all ml_risk_score values     │
│ Burst Rate              │  0.15  │ events/sec (capped at 100/sec)       │
│ Failure Rate            │  0.15  │ FAILED events / total events         │
│ Data Corruption Rate    │  0.10  │ Entries with missing fields / total  │
│ Asset Spread            │  0.10  │ (unique servers + firewalls) / 10    │
└─────────────────────────┴────────┴──────────────────────────────────────┘

Each factor is normalized to 0–10, multiplied by its weight, and summed.
Final score is capped at 10.
```

**Example calculation for `faulty_logs_100.csv`:**
- Critical density: 100/100 = 100% → score 10.0 × 0.30 = 3.0
- Avg ML risk: 0.9524 → score 9.5 × 0.20 = 1.9
- Burst rate: 100,000/sec → capped → score 10.0 × 0.15 = 1.5
- Failure rate: 100% → score 10.0 × 0.15 = 1.5
- Corruption: 66% → score 6.6 × 0.10 = 0.66
- Asset spread: 4 assets → score 4.0 × 0.10 = 0.4
- **Total: 9.0/10** ✅

---

## 📑 Report Sections & Data Derivation

The AI report contains exactly **11 sections**, each derived from runtime data:

| # | Section | Data Source |
|---|---|---|
| 1 | **Breach Summary** | Total events, unique servers/firewalls, time range, attack types, failure rate, corruption rate |
| 2 | **Key Dataset Anomalies Detected** | 7 anomaly checks: density, timestamp clustering, field nullification, dual-identity patterns, kill chain, failure persistence, phantom infrastructure |
| 3 | **Attack Timeline Reconstruction** | Grouped by action_type phases with timestamp sorting: Initial Access → Credential Attack → Unauthorized Access → Privilege Escalation → Destruction |
| 4 | **Root Cause Hypothesis Based on Data Patterns** | Inferred from: timing intervals, user identities, action progression, field corruption %, non-standard IDs |
| 5 | **Impacted Entities or Assets** | Top 10 servers + firewalls by event count, with severity rating based on concentration |
| 6 | **Vulnerabilities Indicated by Dataset Behavior** | 6 vulnerabilities derived from: missing rate-limiting, no MFA evidence, config endpoint exposure, etc. |
| 7 | **Risk Score (0–10 with Justification)** | Weighted formula with full breakdown of each factor |
| 8 | **Immediate Containment Actions** | 7 specific actions referencing actual server IDs, user accounts, and firewall IDs from the data |
| 9 | **Recovery Strategy** | 7 steps referencing actual data quantities and timeline windows |
| 10 | **Long-Term Prevention Recommendations** | 9 recommendations tied to specific gaps found in the data |
| 11 | **Dataset Security Insights for Future Detection** | 6 meta-observations about the dataset itself for ML model training |

---

## 🔌 API Endpoints

### Authentication (`/api`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | — | Create new user |
| POST | `/api/login` | — | Login, returns JWT token |

### Policies (`/api`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/policies` | JWT | List all policies |
| POST | `/api/policies` | JWT | Create a new policy |

### Agents (`/api/agents`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/agents/register` | API Key | Register new agent |
| POST | `/api/agents/heartbeat` | API Key | Agent heartbeat |
| POST | `/api/agents/metrics` | API Key | Submit agent metrics |
| POST | `/api/agents/logs` | API Key | Submit agent logs |
| GET | `/api/agents/policies` | API Key | Get policies for agent |
| POST | `/api/agents/policy-status` | API Key | Update policy status |
| POST | `/api/agents/deregister` | API Key | Deregister agent |
| GET | `/api/agents` | — | List all agents |
| GET | `/api/agents/:agentId` | — | Get agent details |

### Breach Analysis (`/api/breach`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/breach/analyze` | — | **AI Breach Analysis** — accepts `{ csvFile }` or `{ rows }` or defaults to faulty_logs_100.csv |
| GET | `/api/breach/csv-preview` | — | Preview CSV data (`?file=...&limit=20`) |

#### Breach Analysis Request Examples:

```bash
# Default (faulty_logs_100.csv)
curl -X POST http://localhost:8080/api/breach/analyze

# Specific CSV file
curl -X POST http://localhost:8080/api/breach/analyze \
  -H "Content-Type: application/json" \
  -d '{"csvFile": "cybersecurity_logs_10k.csv"}'

# Direct row data
curl -X POST http://localhost:8080/api/breach/analyze \
  -H "Content-Type: application/json" \
  -d '{"rows": [{"timestamp":"...","server_id":"srv-001",...}]}'
```

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Database connectivity check |

---

## 🗃️ Database Schema

```sql
-- Users (authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- Policies (firewall rules)
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    definition JSONB NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agents (remote security agents)
CREATE TABLE agents (
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
    last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs (security event logs)
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    server_id VARCHAR(255),
    firewall_id VARCHAR(255),
    username VARCHAR(255),
    action_type VARCHAR(100),
    policy_name VARCHAR(255),
    policy_rule TEXT,
    status VARCHAR(50),
    ml_risk_score NUMERIC(5, 4),
    log_source VARCHAR(100),
    blockchain_tx TEXT,
    notes TEXT
);
```

---

## ✅ Prerequisites

- **Node.js** v20.19+ or v22.12+ (required by Vite 7)
- **npm** (comes with Node.js)
- **PostgreSQL** 13+ (for user auth, policies, agents)
- **nvm** (recommended for managing Node versions)

---

## 🚀 How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/Buggie18/cyber-portal.git
cd cyber-portal
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create/edit `.env` file:
```env
PORT=8080
DB_USER=cyberuser
DB_HOST=localhost
DB_NAME=cyber_portal
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=your-secret-key-here
INIT_DB=true    # Set true on first run to create tables
```

Ensure PostgreSQL is running and the database exists:
```bash
createdb cyber_portal   # or use pgAdmin
```

Start the backend:
```bash
npm start
# 🚀 Server running at http://localhost:8080
```

> After first run, set `INIT_DB=false` in `.env`

### 3. Set Up the Frontend

```bash
cd ../portal-frontend
npm install
```

Ensure correct Node version:
```bash
nvm use 20    # or nvm use 22
```

Start the dev server:
```bash
npm run dev
# ➜ Local: http://localhost:5173/
```

### 4. Access the Application

1. Open `http://localhost:5173` in your browser
2. Click **Register** → Create an account
3. **Login** with your credentials
4. Navigate to **Internal Agent** from the dashboard
5. Click **Simulate Breach** → generates 100 threat events
6. Click **Generate AI Report** → triggers real-time CSV analysis
7. Click **View AI Report** → see the full 11-section incident response report

---

## 🎮 Usage Walkthrough

### Flow 1: Breach Simulation & AI Report

```
Dashboard → Internal Agent → "Simulate Breach" (100 events loaded)
    ↓
Red Alert Banner appears across all pages: "🚨 CRITICAL SYSTEM LOCKDOWN"
    ↓
Click "Generate AI Report" (banner or Internal Agent page)
    ↓
Backend reads faulty_logs_100.csv → 12-stage analysis → JSON report
    ↓
Report Summary Card appears with Risk Score badge
    ↓
Click "View AI Report" → Full 11-section BreachReport page
    ↓
"Resolve" clears the breach state
```

### Flow 2: Security Prediction (ML)

```
Dashboard → "Predict Security" → Fill form (server_id, action_type, etc.)
    ↓
Sends to ModelBit ML API → Returns risk level, scores, alerts, recommendations
    ↓
Displays Radar chart + Line chart + Risk cards
```

### Flow 3: Policy Management

```
Dashboard → "Add Policy" → Fill policy form → Saved to PostgreSQL
Dashboard → "View Policies" → Table of all policies
```

---

## 📊 CSV Dataset Format

Both CSV files follow this schema:

```csv
timestamp,server_id,firewall_id,user,action_type,policy_name,policy_rule,status,ml_risk_score,log_source,blockchain_tx,notes
```

| Column | Type | Example | Description |
|---|---|---|---|
| `timestamp` | ISO 8601 | `2026-02-21T19:28:28.164572` | Event timestamp |
| `server_id` | String | `srv-001`, `srv-999` | Source server (can be null) |
| `firewall_id` | String | `fw-001`, `fw-500` | Firewall involved (can be null) |
| `user` | String | `root`, `hacker`, `admin` | User account (can be null) |
| `action_type` | String | `BRUTE_FORCE`, `LOGIN` | Type of security event |
| `policy_name` | String | `Allow SSH` | Policy name (optional) |
| `policy_rule` | String | `allow tcp 22` | Policy rule (optional) |
| `status` | String | `SUCCESS`, `FAILED` | Event outcome |
| `ml_risk_score` | Float | `0.9661` | ML-computed anomaly score (0–1) |
| `log_source` | String | `EXTERNAL_ATTACK`, `backend` | Event source |
| `blockchain_tx` | Hex | `0x8f6ba2...` | Blockchain transaction hash (optional) |
| `notes` | String | `Anomalous activity detected` | Freeform notes |

### Included Datasets

| File | Events | Purpose |
|---|---|---|
| `faulty_logs_100.csv` | 100 | **Attack simulation** — all EXTERNAL_ATTACK, risk scores 0.9+, includes BRUTE_FORCE, UNAUTHORIZED_LOGIN, MALICIOUS_ACCESS, CONFIG_WIPE |
| `cybersecurity_logs_10k.csv` | 10,000 | **Normal operations** — mixed actions (LOGIN, ADD_POLICY, DELETE_POLICY, CONFIG_UPDATE), varied risk scores (0.0–1.0), blockchain + backend sources |

---

## 🖼️ Screenshots / UI Flow

### Pages Overview

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Public landing page with login/register CTAs |
| Login | `/login` | JWT authentication form |
| Register | `/register` | User registration form |
| Dashboard | `/dashboard` | Card-based navigation hub (7 features) |
| Policies | `/policies` | View/add firewall policies |
| Agents | `/agents` | Agent management with 10k log viewer |
| Internal Agent | `/internal-agent` | Breach simulator + AI report trigger |
| **Breach Report** | `/breach-report` | **Full 11-section AI incident response report** |
| Security Prediction | `/security-prediction` | ML prediction with Radar + Line charts |

### Global Components

| Component | Description |
|---|---|
| `Navbar` | Top bar with navigation links, theme toggle, and auth controls |
| `SecurityAlertBanner` | Sticky red banner during active breach — includes "Generate AI Report" and "Resolve" buttons |
| `ProtectedRoute` | JWT-guarded route wrapper that redirects to login if unauthenticated |

---

## 🔒 Security Concepts Implemented

| Concept | Implementation |
|---|---|
| **Authentication** | bcrypt password hashing + JWT tokens |
| **Authorization** | Protected routes (frontend) + JWT middleware (backend) |
| **RBAC** | User/Admin roles in database |
| **Anomaly Detection** | Statistical analysis of ML risk scores, action frequencies, timestamp clustering |
| **Kill Chain Detection** | BRUTE_FORCE → UNAUTHORIZED_LOGIN → MALICIOUS_ACCESS → CONFIG_WIPE progression |
| **Anti-Forensic Detection** | Missing field analysis (server_id, firewall_id, user nullification) |
| **Phantom Infrastructure** | Detection of non-standard server/firewall IDs (srv-999, fw-500) |
| **Brute Force Detection** | Frequency analysis of BRUTE_FORCE action type |
| **Burst Density** | Events-per-second calculation for automated tool detection |
| **Blockchain Audit Trail** | Smart contract verification for policy change integrity |
| **Risk Scoring** | Weighted multi-factor composite score (not arbitrary) |

---

## 🔮 Future Scope

- [ ] **Real-time WebSocket** integration for live log streaming
- [ ] **LLM Integration** (OpenAI/Gemini) for natural language report narrative generation
- [ ] **SIEM Connector** for ingesting logs from Splunk, ELK, QRadar
- [ ] **Automated Playbook Execution** (SOAR-style auto-containment)
- [ ] **User Behavior Analytics (UBA)** with session tracking
- [ ] **Network Graph Visualization** of attacker lateral movement
- [ ] **PDF Export** of breach reports with corporate branding
- [ ] **Email/Slack Alerts** for breach notifications
- [ ] **Multi-tenant Support** for managing multiple organizations
- [ ] **Compliance Mapping** (NIST, ISO 27001, SOC2) in reports

---

## 📝 License

This project is for educational and demonstration purposes.

---

## 👥 Contributors

- **Buggie18** — [GitHub](https://github.com/Buggie18)
- **ashmita-web** - [GitHub](https://github.com/ashmita-web)

---

<p align="center">
  <strong>Built with 🔐 for cybersecurity education and real-world SOC simulation</strong>
</p>
