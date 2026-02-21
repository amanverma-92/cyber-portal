// src/components/Navbar.jsx
import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ColorModeContext } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        background: theme.palette.mode === "dark"
          ? "rgba(10, 14, 39, 0.95)"
          : "rgba(25, 118, 210, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          onClick={() => {
            const hasToken = !!localStorage.getItem("token");
            navigate(hasToken ? "/dashboard" : "/");
          }}
          sx={{
            color: "inherit",
            textDecoration: "none",
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: 600,
            background: theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Cybersecurity Portal
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={colorMode.mode === "dark" ? "Switch to light" : "Switch to dark"}>
            <IconButton color="inherit" onClick={colorMode.toggleColorMode} aria-label="Toggle theme">
              {colorMode.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/policies?mode=view">
                Policies
              </Button>
              <Button color="inherit" component={Link} to="/security-prediction">
                Predict Security
              </Button>
              <Button color="inherit" component={Link} to="/agents">
                Agents
              </Button>
              <Button color="inherit" component={Link} to="/internal-agent">
                Internal Agent
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
