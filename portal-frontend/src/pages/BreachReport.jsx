import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    IconButton,
    LinearProgress,
    Tooltip,
    useTheme,
} from "@mui/material";
import {
    ArrowBack,
    Print,
    ExpandMore,
    ExpandLess,
    Warning,
    Security,
    BugReport,
    Speed,
    Storage,
    Shield,
    Analytics,
    Insights,
    HealthAndSafety,
    DataObject,
} from "@mui/icons-material";
import { useSecurity } from "../context/SecurityContext";

/* ─── helpers ──────────────────────────────────────────────────────── */
const SectionTitle = ({ icon, children }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 5, mb: 1.5 }}>
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {children}
        </Typography>
    </Box>
);

const severityColor = (s) => {
    if (s === "Critical") return "error";
    if (s === "High") return "warning";
    if (s === "Medium") return "info";
    return "default";
};

const riskGradient = (score) => {
    if (score >= 8) return "linear-gradient(135deg, #d32f2f, #ff1744)";
    if (score >= 5) return "linear-gradient(135deg, #ed6c02, #ff9100)";
    return "linear-gradient(135deg, #2e7d32, #00c853)";
};

const formatTime = (iso) => {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
};

/* ─── Collapsible section wrapper ──────────────────────────────────── */
function CollapsibleSection({ title, icon, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Box>
            <Box
                onClick={() => setOpen(!open)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 5,
                    mb: 1.5,
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": { opacity: 0.8 },
                }}
            >
                {icon}
                <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                    {title}
                </Typography>
                <IconButton size="small">
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>
            <Collapse in={open}>{children}</Collapse>
        </Box>
    );
}

/* ─── Main Report ──────────────────────────────────────────────────── */
const BreachReport = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { breachReport } = useSecurity();

    const isDark = theme.palette.mode === "dark";

    if (!breachReport) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDark
                        ? "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a1f3a 100%)"
                        : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
                }}
            >
                <Paper
                    sx={{
                        p: 5,
                        textAlign: "center",
                        maxWidth: 460,
                        borderRadius: 4,
                        background: isDark
                            ? "rgba(22,27,34,0.95)"
                            : "rgba(255,255,255,0.97)",
                        backdropFilter: "blur(16px)",
                        border: `1px solid ${isDark ? "rgba(74,144,226,0.2)" : "rgba(25,118,210,0.15)"
                            }`,
                    }}
                >
                    <Security sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        No Breach Report Available
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Simulate a breach from the Internal Agent page to trigger
                        real-time AI analysis.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/internal-agent")}
                        startIcon={<Shield />}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    >
                        Go to Internal Agent
                    </Button>
                </Paper>
            </Box>
        );
    }

    const r = breachReport;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: isDark
                    ? "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a1f3a 100%)"
                    : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
                py: 5,
            }}
        >
            <Container maxWidth="md">
                {/* ─── Toolbar ─── */}
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Button
                        size="small"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/internal-agent")}
                        sx={{ textTransform: "none" }}
                    >
                        Back to Agent
                    </Button>
                    <Button
                        size="small"
                        startIcon={<Print />}
                        onClick={() => window.print()}
                        sx={{ textTransform: "none" }}
                    >
                        Print Report
                    </Button>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        background: isDark
                            ? "rgba(22, 27, 34, 0.92)"
                            : "rgba(255,255,255,0.97)",
                        backdropFilter: "blur(16px)",
                        border: `1px solid ${isDark
                                ? "rgba(74,144,226,0.15)"
                                : "rgba(25,118,210,0.12)"
                            }`,
                        borderRadius: 4,
                    }}
                >
                    {/* ══════ HEADER ══════ */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                                🛡️ AI Incident Response Report
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontFamily: "monospace" }}
                            >
                                Breach ID: {r.breachId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Generated: {formatTime(r.generatedAt)}
                            </Typography>
                        </Box>
                        {/* Risk Score Badge */}
                        <Box
                            sx={{
                                px: 3,
                                py: 1.5,
                                borderRadius: 3,
                                background: riskGradient(r.riskScore),
                                color: "#fff",
                                textAlign: "center",
                                minWidth: 100,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{ fontWeight: 900, lineHeight: 1 }}
                            >
                                {r.riskScore}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ fontWeight: 600, opacity: 0.9 }}
                            >
                                / 10 RISK
                            </Typography>
                        </Box>
                    </Box>

                    {/* ─── Meta chips ─── */}
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                        <Chip
                            icon={<DataObject />}
                            label={`${r.meta.totalLogs} events`}
                            size="small"
                            variant="outlined"
                        />
                        <Chip
                            icon={<Warning />}
                            label={`${r.meta.highRiskEvents} critical`}
                            size="small"
                            color="error"
                            variant="outlined"
                        />
                        <Chip
                            icon={<Speed />}
                            label={`${r.meta.eventsPerSecond}/sec burst`}
                            size="small"
                            variant="outlined"
                        />
                        <Chip
                            icon={<BugReport />}
                            label={`${r.meta.corruptedEntries} corrupted`}
                            size="small"
                            color="warning"
                            variant="outlined"
                        />
                        {r.meta.attackTypes.map((t) => (
                            <Chip key={t} label={t} size="small" color="default" />
                        ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* ══════ 1. BREACH SUMMARY ══════ */}
                    <CollapsibleSection
                        title="Breach Summary"
                        icon={<Analytics color="primary" />}
                    >
                        <Typography
                            variant="body1"
                            sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}
                        >
                            {r.breachSummary}
                        </Typography>
                    </CollapsibleSection>

                    {/* ══════ 2. KEY DATASET ANOMALIES DETECTED ══════ */}
                    <CollapsibleSection
                        title="Key Dataset Anomalies Detected"
                        icon={<BugReport color="error" />}
                    >
                        {r.keyAnomalies.map((a) => (
                            <Paper
                                key={a.id}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    mb: 1.5,
                                    borderLeft: "4px solid",
                                    borderLeftColor: "error.main",
                                    borderRadius: 2,
                                    background: isDark
                                        ? "rgba(211,47,47,0.04)"
                                        : "rgba(211,47,47,0.02)",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    <Chip
                                        label={a.id}
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        sx={{ fontFamily: "monospace", fontWeight: 700 }}
                                    />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        {a.title}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {a.description}
                                </Typography>
                            </Paper>
                        ))}
                    </CollapsibleSection>

                    {/* ══════ 3. ATTACK TIMELINE RECONSTRUCTION ══════ */}
                    <CollapsibleSection
                        title="Attack Timeline Reconstruction"
                        icon={<Speed color="warning" />}
                    >
                        <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                                width: 180,
                                                background: isDark
                                                    ? "rgba(74,144,226,0.08)"
                                                    : "rgba(25,118,210,0.06)",
                                            }}
                                        >
                                            Timestamp
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                                width: 140,
                                                background: isDark
                                                    ? "rgba(74,144,226,0.08)"
                                                    : "rgba(25,118,210,0.06)",
                                            }}
                                        >
                                            Phase
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                                background: isDark
                                                    ? "rgba(74,144,226,0.08)"
                                                    : "rgba(25,118,210,0.06)",
                                            }}
                                        >
                                            Event Description
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {r.attackTimeline.map((t, i) => (
                                        <TableRow key={i}>
                                            <TableCell
                                                sx={{
                                                    fontFamily: "monospace",
                                                    fontSize: "0.75rem",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {formatTime(t.time)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={t.phase}
                                                    size="small"
                                                    color={
                                                        t.phase.includes("Destruct")
                                                            ? "error"
                                                            : t.phase.includes("Escalation")
                                                                ? "warning"
                                                                : "info"
                                                    }
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: "0.85rem" }}>
                                                {t.event}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CollapsibleSection>

                    {/* ══════ 4. ROOT CAUSE HYPOTHESIS BASED ON DATA PATTERNS ══════ */}
                    <CollapsibleSection
                        title="Root Cause Hypothesis Based on Data Patterns"
                        icon={<Insights color="secondary" />}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 2,
                                whiteSpace: "pre-line",
                                "& strong": { color: "primary.main" },
                            }}
                            dangerouslySetInnerHTML={{
                                __html: r.rootCauseHypothesis
                                    .replace(
                                        /\*\*(.*?)\*\*/g,
                                        '<strong>$1</strong>'
                                    ),
                            }}
                        />
                    </CollapsibleSection>

                    {/* ══════ 5. IMPACTED ENTITIES OR ASSETS ══════ */}
                    <CollapsibleSection
                        title="Impacted Entities or Assets"
                        icon={<Storage color="error" />}
                    >
                        <TableContainer sx={{ borderRadius: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Asset</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            Event Count
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {r.impactedEntities.map((a, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ fontFamily: "monospace" }}>
                                                {a.name}
                                            </TableCell>
                                            <TableCell>{a.type}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={a.severity}
                                                    size="small"
                                                    color={severityColor(a.severity)}
                                                />
                                            </TableCell>
                                            <TableCell>{a.eventCount}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color:
                                                        a.severity === "Critical"
                                                            ? "error.main"
                                                            : "text.secondary",
                                                    fontWeight:
                                                        a.severity === "Critical" ? 700 : 400,
                                                }}
                                            >
                                                {a.status}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CollapsibleSection>

                    {/* ══════ 6. VULNERABILITIES INDICATED BY DATASET BEHAVIOR ══════ */}
                    <CollapsibleSection
                        title="Vulnerabilities Indicated by Dataset Behavior"
                        icon={<Warning color="warning" />}
                    >
                        {r.vulnerabilities.map((v) => (
                            <Paper
                                key={v.id}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    mb: 1.5,
                                    borderLeft: "4px solid",
                                    borderLeftColor:
                                        v.severity === "Critical"
                                            ? "error.main"
                                            : v.severity === "High"
                                                ? "warning.main"
                                                : "info.main",
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    <Chip
                                        label={v.severity}
                                        size="small"
                                        color={severityColor(v.severity)}
                                    />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        {v.id}: {v.title}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {v.description}
                                </Typography>
                            </Paper>
                        ))}
                    </CollapsibleSection>

                    {/* ══════ 7. RISK SCORE (0–10) WITH JUSTIFICATION ══════ */}
                    <CollapsibleSection
                        title="Risk Score (0–10 with Justification)"
                        icon={<Analytics sx={{ color: r.riskScore >= 8 ? "#d32f2f" : r.riskScore >= 5 ? "#ed6c02" : "#2e7d32" }} />}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                mb: 2,
                                p: 2,
                                borderRadius: 3,
                                background: isDark
                                    ? "rgba(255,255,255,0.03)"
                                    : "rgba(0,0,0,0.02)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: riskGradient(r.riskScore),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                                    flexShrink: 0,
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 900, color: "#fff" }}
                                >
                                    {r.riskScore}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={r.riskScore * 10}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        mb: 1,
                                        bgcolor: isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : "rgba(0,0,0,0.08)",
                                        "& .MuiLinearProgress-bar": {
                                            borderRadius: 5,
                                            background: riskGradient(r.riskScore),
                                        },
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.6 }}
                                >
                                    {r.riskJustification}
                                </Typography>
                            </Box>
                        </Box>
                    </CollapsibleSection>

                    {/* ══════ 8. IMMEDIATE CONTAINMENT ACTIONS ══════ */}
                    <CollapsibleSection
                        title="Immediate Containment Actions"
                        icon={<HealthAndSafety color="error" />}
                    >
                        <Box component="ol" sx={{ pl: 3, m: 0 }}>
                            {r.immediateActions.map((a, i) => (
                                <li key={i} style={{ marginBottom: 8 }}>
                                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                        {a}
                                    </Typography>
                                </li>
                            ))}
                        </Box>
                    </CollapsibleSection>

                    {/* ══════ 9. RECOVERY STRATEGY ══════ */}
                    <CollapsibleSection
                        title="Recovery Strategy"
                        icon={
                            <Shield sx={{ color: "#2e7d32" }} />
                        }
                    >
                        <Box component="ol" sx={{ pl: 3, m: 0 }}>
                            {r.recoveryStrategy.map((s, i) => (
                                <li key={i} style={{ marginBottom: 8 }}>
                                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                        {s}
                                    </Typography>
                                </li>
                            ))}
                        </Box>
                    </CollapsibleSection>

                    {/* ══════ 10. LONG-TERM PREVENTION RECOMMENDATIONS ══════ */}
                    <CollapsibleSection
                        title="Long-Term Prevention Recommendations"
                        icon={<Security color="primary" />}
                    >
                        <Box component="ol" sx={{ pl: 3, m: 0 }}>
                            {r.longTermPrevention.map((p, i) => (
                                <li key={i} style={{ marginBottom: 8 }}>
                                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                        {p}
                                    </Typography>
                                </li>
                            ))}
                        </Box>
                    </CollapsibleSection>

                    {/* ══════ 11. DATASET SECURITY INSIGHTS FOR FUTURE DETECTION ══════ */}
                    <CollapsibleSection
                        title="Dataset Security Insights for Future Detection"
                        icon={<DataObject color="info" />}
                    >
                        {r.datasetInsights.map((insight, i) => (
                            <Paper
                                key={i}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    mb: 1.5,
                                    borderRadius: 2,
                                    borderLeft: "4px solid",
                                    borderLeftColor: "info.main",
                                    background: isDark
                                        ? "rgba(25,118,210,0.04)"
                                        : "rgba(25,118,210,0.02)",
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                                    <Chip
                                        label={`INSIGHT-${String(i + 1).padStart(2, "0")}`}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                        sx={{ fontFamily: "monospace", fontWeight: 700, flexShrink: 0 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {insight}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))}
                    </CollapsibleSection>

                    {/* ─── Action Breakdown Chart ─── */}
                    {r.meta.actionBreakdown && (
                        <CollapsibleSection
                            title="Attack Type Distribution (from Dataset)"
                            icon={<Analytics color="secondary" />}
                            defaultOpen={false}
                        >
                            {r.meta.actionBreakdown.map((ab) => (
                                <Box key={ab.action} sx={{ mb: 1.5 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 0.5,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, fontFamily: "monospace" }}
                                        >
                                            {ab.action}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {ab.count} ({ab.pct}%)
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={parseFloat(ab.pct)}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: isDark
                                                ? "rgba(255,255,255,0.06)"
                                                : "rgba(0,0,0,0.06)",
                                            "& .MuiLinearProgress-bar": {
                                                borderRadius: 4,
                                                background:
                                                    ab.action === "BRUTE_FORCE"
                                                        ? "linear-gradient(90deg, #d32f2f, #ff5252)"
                                                        : ab.action === "CONFIG_WIPE"
                                                            ? "linear-gradient(90deg, #ff6d00, #ffab00)"
                                                            : ab.action === "MALICIOUS_ACCESS"
                                                                ? "linear-gradient(90deg, #7b1fa2, #ce93d8)"
                                                                : "linear-gradient(90deg, #1565c0, #42a5f5)",
                                            },
                                        }}
                                    />
                                </Box>
                            ))}
                        </CollapsibleSection>
                    )}

                    <Divider sx={{ my: 4 }} />

                    {/* ─── Footer ─── */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            This report was dynamically generated by the Cyber-Portal AI
                            engine from real-time breach telemetry data. Every conclusion
                            is derived directly from the supplied anomaly dataset. Report
                            ID: <code>{r.breachId}</code>
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Print this report">
                                <IconButton size="small" onClick={() => window.print()}>
                                    <Print fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate("/internal-agent")}
                                startIcon={<ArrowBack />}
                                sx={{ textTransform: "none" }}
                            >
                                Back
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default BreachReport;
