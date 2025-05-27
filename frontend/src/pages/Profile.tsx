import {
  Container,
  Paper,
  Typography,
  Box,
  Grid as MuiGrid,
  TextField,
  IconButton,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import type { GridProps } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Grid = MuiGrid as React.ComponentType<
  GridProps & {
    item?: boolean;
    container?: boolean;
    xs?: number;
  }
>;

interface UserProfile {
  id: string;
  username: string;
  email: string;
}

const Profile = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    username: "",
    email: "",
  });
  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    id: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

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
        const errorData = await response.text();
        throw new Error(`Failed to fetch profile: ${errorData}`);
      }

      const data = await response.json();
      setProfile(data);
      setEditedProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile information"
      );
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editedProfile.username,
          email: editedProfile.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update profile: ${errorData}`);
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setEditedProfile(updatedData);
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
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isLoggedIn) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t("profile.title", { defaultValue: "Profile" })}
          </Typography>
          {!isEditing ? (
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
          ) : (
            <Box>
              <IconButton onClick={handleSave} color="primary" sx={{ mr: 1 }}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel} color="error">
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("profile.username", { defaultValue: "Username" })}
              name="username"
              value={isEditing ? editedProfile.username : profile.username}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("profile.email", { defaultValue: "Email" })}
              name="email"
              type="email"
              value={isEditing ? editedProfile.email : profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
