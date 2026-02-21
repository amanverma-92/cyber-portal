// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Policies from "./pages/Policies";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SecurityPredictionPage from "./pages/SecurityPredictionPage";
import Agents from './pages/Agents';
import InternalAgent from './pages/InternalAgent';

// Import Demo Components
import { SecurityProvider } from "./context/SecurityContext";
import SecurityAlertBanner from "./components/SecurityAlertBanner";

function App() {
  const token = localStorage.getItem("token");

  return (
    <SecurityProvider>
      <Navbar />
      {/* Global alert visible on all pages when the "Attack" is active */}
      <SecurityAlertBanner />
      
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policies"
          element={
            <ProtectedRoute>
              <Policies />
            </ProtectedRoute>
          }
        />
        
        {/* Protected Agent route to show the 100 faulty logs */}
        <Route 
          path="/agents" 
          element={
            <ProtectedRoute>
              <Agents />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/internal-agent"
          element={
            <ProtectedRoute>
              <InternalAgent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/security-prediction"
          element={
            <ProtectedRoute>
              <SecurityPredictionPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </SecurityProvider>
  );
}

export default App;