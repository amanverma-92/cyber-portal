// src/api/securityApi.js
const API_BASE = "/api";

export const fetchLogs = async () => {
  const res = await fetch(`${API_BASE}/logs`);
  return res.json();
};

export const getSystemStatus = async () => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/system-status`, { headers });
  return res.json();
};

export const triggerAttack = async () => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return fetch(`${API_BASE}/simulate-attack`, { method: "POST", headers });
};

/** Loads 100 faulty logs from CSV - no auth required (for demo) */
export const triggerAttackFromCsv = async () => {
  const res = await fetch(`${API_BASE}/logs/simulate-attack-from-csv`, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Simulate attack failed");
  return data;
};