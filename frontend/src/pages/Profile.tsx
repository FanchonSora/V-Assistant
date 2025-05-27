import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
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
import { get, post } from "../utils/api";

const Grid = MuiGrid as React.ComponentType<
  GridProps & {
    item?: boolean;
    container?: boolean;
    xs?: number;
  }
>;

interface UserProfile {
  name: string;
  email: string;
}

const Profile = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await get<UserProfile>("/users/me", token || undefined);
        setProfile(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch profile"
        );
      }
    };
    fetchProfile();
  }, [token]);

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      await post("/users/me", profile, token || undefined);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleChange =
    (field: keyof UserProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfile({ ...profile, [field]: event.target.value });
    };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" component="h1">
            {t("profile.title", "Profile")}
          </Typography>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              {t("profile.edit", "Edit Profile")}
            </Button>
          ) : (
            <Box>
              <IconButton color="primary" onClick={handleSave} sx={{ mr: 1 }}>
                <SaveIcon />
              </IconButton>
              <IconButton color="error" onClick={handleCancel}>
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
              label={t("profile.name", "Name")}
              value={profile.name}
              onChange={handleChange("name")}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("profile.email", "Email")}
              value={profile.email}
              onChange={handleChange("email")}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
