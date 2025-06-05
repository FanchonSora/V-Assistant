import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Fade,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { mode } = useThemeContext();

  // Mock translation function for demo
  const t = (key: string) => {
    const translations: Record<string, string> = {
      "welcome.title": "Welcome to AI Assistant",
      "welcome.subtitle":
        "Experience the future of intelligent conversation with our advanced AI assistant",
      "welcome.getStarted": "Ready to start your AI-powered journey?",
      "features.smartAssistant.title": "Smart Assistant",
      "features.smartAssistant.description":
        "Advanced AI that understands context and provides intelligent responses",
      "features.easyIntegration.title": "Easy Integration",
      "features.easyIntegration.description":
        "Seamlessly integrate with your existing workflow and tools",
      "features.support.title": "24/7 Support",
      "features.support.description":
        "Round-the-clock assistance whenever you need help",
      "features.customization.title": "Full Customization",
      "features.customization.description":
        "Tailor the experience to match your specific needs and preferences",
    };
    return translations[key] || key;
  };

  const features = [
    {
      title: t("features.smartAssistant.title"),
      description: t("features.smartAssistant.description"),
      icon: "🤖",
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
    },
    {
      title: t("features.easyIntegration.title"),
      description: t("features.easyIntegration.description"),
      icon: "⚡",
      color: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
    },
    {
      title: t("features.support.title"),
      description: t("features.support.description"),
      icon: "🛡️",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      title: t("features.customization.title"),
      description: t("features.customization.description"),
      icon: "🎨",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
    {
      title: "Real-time Updates",
      description:
        "Get instant notifications and live updates for all your important tasks and events",
      icon: "🔄",
      color: "#EC4899",
      gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
    },
    {
      title: "Data Analytics",
      description:
        "Comprehensive insights and analytics to track your productivity and progress",
      icon: "📊",
      color: "#6366F1",
      gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: "👥" },
    { label: "Messages Sent", value: "1M+", icon: "💬" },
    { label: "Satisfaction", value: "99%", icon: "⭐" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: mode === "dark" ? 0.05 : 0.1,
          background: `
            radial-gradient(circle at 20% 80%, ${
              mode === "dark" ? "#ffffff" : "#fff"
            } 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${
              mode === "dark" ? "#ffffff" : "#fff"
            } 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${
              mode === "dark" ? "#ffffff" : "#fff"
            } 0%, transparent 50%)
          `,
          animation: "float 20s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Fade in timeout={1000}>
          <Box sx={{ py: { xs: 8, md: 12 }, textAlign: "center" }}>
            <Chip
              label="✨ New: Enhanced AI Capabilities"
              sx={{
                mb: 3,
                bgcolor:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(255, 255, 255, 0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                border: `1px solid ${
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(255, 255, 255, 0.3)"
                }`,
                fontSize: "0.9rem",
                height: 36,
              }}
            />

            <Typography
              variant={isMobile ? "h3" : "h2"}
              component="h1"
              gutterBottom
              sx={{
                color: "white",
                fontWeight: 800,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                mb: 3,
                background: "linear-gradient(45deg, #fff 30%, #e0e7ff 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("welcome.title")}
            </Typography>

            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              {t("welcome.subtitle")}
            </Typography>

            {/* Stats */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
              {stats.map((stat, index) => (
                <Grid key={index} component="div">
                  <Slide in timeout={1000 + index * 200} direction="up">
                    <Card
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        minWidth: 120,
                        textAlign: "center",
                        borderRadius: 3,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      {
                        <CardContent sx={{ py: 2 }}>
                          <Typography variant="h4" sx={{ mb: 1 }}>
                            {stat.icon}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {stat.label}
                          </Typography>
                        </CardContent>
                      }
                    </Card>
                  </Slide>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/chat")}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                boxShadow: "0 8px 32px rgba(255, 107, 107, 0.4)",
                transform: "translateY(0)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(255, 107, 107, 0.6)",
                  background:
                    "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
                },
              }}
            >
              Start Chatting →
            </Button>
          </Box>
        </Fade>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Fade in timeout={1500}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 6,
                textShadow:
                  mode === "dark"
                    ? "0 2px 10px rgba(0,0,0,0.5)"
                    : "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              Powerful Features
            </Typography>
          </Fade>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Slide in timeout={2000 + index * 200} direction="up">
                  <Card
                    sx={{
                      height: "320px",
                      width: "100%",
                      maxWidth: "400px",
                      mx: "auto",
                      background:
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(255, 255, 255, 0.2)"
                      }`,
                      borderRadius: "20px",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow:
                          mode === "dark"
                            ? "0 20px 60px rgba(0, 0, 0, 0.5)"
                            : "0 20px 60px rgba(0, 0, 0, 0.3)",
                        background:
                          mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(255, 255, 255, 0.15)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 4,
                        textAlign: "center",
                        color: "white",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          background: feature.gradient,
                          mx: "auto",
                          mb: 3,
                          fontSize: "2rem",
                          boxShadow: `0 8px 32px ${feature.color}40`,
                          animation: "pulse 2s ease-in-out infinite",
                          "@keyframes pulse": {
                            "0%, 100%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.05)" },
                          },
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          lineHeight: 1.6,
                          maxWidth: "280px",
                          mx: "auto",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Fade in timeout={2500}>
          <Box
            sx={{
              py: 8,
              textAlign: "center",
              borderRadius: "30px",
              background:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.2)"
              }`,
              mx: 2,
              mb: 8,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background:
                  mode === "dark"
                    ? "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.05), transparent)"
                    : "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)",
                animation: "rotate 10s linear infinite",
                "@keyframes rotate": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
                🚀
              </Typography>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {t("welcome.getStarted")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 4,
                  maxWidth: "500px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Join thousands of users who are already experiencing the power
                of AI-assisted conversations.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/chat")}
                sx={{
                  borderRadius: "50px",
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                Get Started Free →
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home;
