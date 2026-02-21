import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Box,
  Card,
  CardContent,
  CardActions,
  useTheme
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Dashboard as DashboardIcon,
  Analytics,
  Assessment,
  Feedback,
  Info,
  Visibility,
  AddCircle,
  Security
} from "@mui/icons-material";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
      } catch {
        setUsername("User");
      }
    }
  }, []);

  const menuOptions = [

    { 
      title: "Analysis", 
      icon: <Analytics />, 
      onClick: () => navigate("/security-prediction"),
      description: "Security analysis and predictions"
    },
    { 
      title: "Agents", 
      icon: <Assessment />, 
      onClick: () => navigate("/agents"),
      description: "Manage and View Agents"
    },
    { 
      title: "Internal Agent", 
      icon: <Security />, 
      onClick: () => navigate("/internal-agent"),
      description: "Network monitor and threat detection"
    },
    { 
      title: "View Policies", 
      icon: <Visibility />, 
      onClick: () => navigate("/policies?mode=view"),
      description: "View all firewall policies"
    },
    { 
      title: "Add Policy", 
      icon: <AddCircle />, 
      onClick: () => navigate("/policies?mode=add"),
      description: "Create a new firewall policy"
    },
    { 
      title: "Feedback", 
      icon: <Feedback />, 
      onClick: () => {
        // Placeholder for feedback route
        alert("Feedback feature coming soon!");
      },
      description: "Share your feedback"
    },
    { 
      title: "About", 
      icon: <Info />, 
      onClick: () => {
        // Placeholder for about route
        alert("About Cybersecurity Portal");
      },
      description: "Learn more about the portal"
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        backgroundAttachment: "fixed",
        py: 6,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === "dark"
            ? "radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)"
            : "radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box 
          sx={{ 
            textAlign: "center", 
            mb: 6,
            animation: "fadeInDown 0.8s ease-out",
            "@keyframes fadeInDown": {
              from: {
                opacity: 0,
                transform: "translateY(-20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              background: theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
              fontSize: { xs: "2.25rem", md: "3.5rem" },
            }}
          >
            Welcome, {username}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
              color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)",
              mb: 1,
              fontWeight: 600,
              letterSpacing: "0.01em",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Cybersecurity Portal
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
              color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              lineHeight: 1.7,
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            Access all portal features and manage your security policies from one central location.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {menuOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: theme.palette.mode === "dark"
                    ? "rgba(26, 31, 58, 0.85)"
                    : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(15px)",
                  border: theme.palette.mode === "dark"
                    ? "1px solid rgba(74, 144, 226, 0.2)"
                    : "1px solid rgba(25, 118, 210, 0.2)",
                  borderRadius: 3,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    from: {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: theme.palette.mode === "dark"
                      ? "0 12px 32px rgba(74, 144, 226, 0.4), 0 0 0 1px rgba(74, 144, 226, 0.1)"
                      : "0 12px 32px rgba(25, 118, 210, 0.4), 0 0 0 1px rgba(25, 118, 210, 0.1)",
                    border: theme.palette.mode === "dark"
                      ? "1px solid rgba(74, 144, 226, 0.5)"
                      : "1px solid rgba(25, 118, 210, 0.5)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 4, pb: 2 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      background: theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                        : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                      color: "white",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "rotate(5deg) scale(1.1)",
                      },
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)",
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                      color: theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.75)"
                        : "rgba(0,0,0,0.65)",
                      minHeight: 40,
                      lineHeight: 1.6,
                      fontSize: { xs: "0.875rem", md: "0.95rem" },
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {option.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    onClick={option.onClick}
                    sx={{
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                      background: theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                        : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                      color: "white",
                      px: 4,
                      py: 1.2,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      letterSpacing: "0.02em",
                      textTransform: "none",
                      boxShadow: theme.palette.mode === "dark"
                        ? "0 4px 12px rgba(74, 144, 226, 0.3)"
                        : "0 4px 12px rgba(25, 118, 210, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, #5aa0f2 0%, #10e4ff 100%)"
                          : "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: theme.palette.mode === "dark"
                          ? "0 6px 16px rgba(74, 144, 226, 0.4)"
                          : "0 6px 16px rgba(25, 118, 210, 0.4)",
                      },
                    }}
                  >
                    Open
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
