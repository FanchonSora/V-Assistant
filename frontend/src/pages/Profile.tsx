import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid as MuiGrid,
  TextField,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import type { GridProps } from "@mui/material";

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
    name: "John Doe",
    email: "john.doe@example.com",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality with API call
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
