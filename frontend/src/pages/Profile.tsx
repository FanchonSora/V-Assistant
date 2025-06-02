// src/pages/Profile.tsx
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid as MuiGrid,
  TextField,
  IconButton,
  Alert,
  Avatar,
  Divider,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { useTranslation } from "react-i18next";
import type { GridProps } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Grid = MuiGrid as React.ComponentType<
  GridProps & {
    item?: boolean;
    container?: boolean;
    xs?: number;
  }
>;

interface UserProfile {
  id?: string;
  username: string;
  email: string;
}

const Profile = () => {
  const { t } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    email: "",
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    username: "",
    email: "",
  });

  // On mount and whenever `user` changes, seed form or fetch real profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "dummy-token") {
      fetchProfile();
    } else if (user) {
      // dummy-token path: just use context values
      setProfile({ username: user.name, email: user.email });
      setEditedProfile({ username: user.name, email: user.email });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch("http://localhost:8000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // on real 401, force logout & redirect
        if (response.status === 401) {
          logout();
          navigate("/auth", { replace: true });
          return;
        }
        const errorData = await response.text();
        throw new Error(`Failed to fetch profile: ${errorData}`);
      }

      const data = await response.json();
      setProfile({ username: data.username, email: data.email });
      setEditedProfile({ username: data.username, email: data.email });
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editedProfile.username,
          email: editedProfile.email,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate("/auth", { replace: true });
          return;
        }
        const errorData = await response.text();
        throw new Error(`Failed to update profile: ${errorData}`);
      }

      const updated = await response.json();
      setProfile({ username: updated.username, email: updated.email });
      setEditedProfile({ username: updated.username, email: updated.email });
      setIsEditing(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isLoggedIn) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows[1],
          }}
        >
          {t("profile.loginFirst", { defaultValue: "Please log in first." })}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: theme.palette.primary.contrastText,
              p: 4,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2rem",
                  fontWeight: 600,
                  bgcolor: alpha("#fff", 0.2),
                  backdropFilter: "blur(10px)",
                  border: `2px solid ${alpha("#fff", 0.3)}`,
                }}
              >
                {profile.username ? (
                  getInitials(profile.username)
                ) : (
                  <PersonIcon fontSize="large" />
                )}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {t("profile.title", { defaultValue: "Profile" })}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                {!isEditing ? (
                  <IconButton
                    onClick={handleEdit}
                    sx={{
                      color: "white",
                      bgcolor: alpha("#fff", 0.1),
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${alpha("#fff", 0.2)}`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: alpha("#fff", 0.2),
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : (
                  <>
                    <IconButton
                      onClick={handleSave}
                      sx={{
                        color: "white",
                        bgcolor: alpha("#4caf50", 0.3),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha("#4caf50", 0.5)}`,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: alpha("#4caf50", 0.4),
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleCancel}
                      sx={{
                        color: "white",
                        bgcolor: alpha("#f44336", 0.3),
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha("#f44336", 0.5)}`,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: alpha("#f44336", 0.4),
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4 }}>
            {/* Alert Messages */}
            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}
            {success && (
              <Fade in>
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${alpha(
                      theme.palette.success.main,
                      0.2
                    )}`,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                  }}
                >
                  {success}
                </Alert>
              </Fade>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ position: "relative" }}>
                  <PersonIcon
                    sx={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: theme.palette.text.secondary,
                      zIndex: 1,
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t("profile.username", { defaultValue: "Username" })}
                    name="username"
                    value={
                      isEditing ? editedProfile.username : profile.username
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        paddingLeft: "40px",
                        transition: "all 0.2s ease-in-out",
                        bgcolor: isEditing
                          ? alpha(theme.palette.primary.main, 0.02)
                          : "transparent",
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 2,
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        paddingLeft: "40px",
                        "&.Mui-focused": {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ position: "relative" }}>
                  <EmailIcon
                    sx={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: theme.palette.text.secondary,
                      zIndex: 1,
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t("profile.email", { defaultValue: "Email" })}
                    name="email"
                    type="email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        paddingLeft: "40px",
                        transition: "all 0.2s ease-in-out",
                        bgcolor: isEditing
                          ? alpha(theme.palette.primary.main, 0.02)
                          : "transparent",
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 2,
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        paddingLeft: "40px",
                        "&.Mui-focused": {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Profile Stats or Additional Info */}
            <Divider sx={{ my: 4, opacity: 0.3 }} />

            <Box
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {t("profile.lastUpdated", {
                  defaultValue:
                    "Profile information can be updated anytime by clicking the edit button above.",
                })}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Profile;
