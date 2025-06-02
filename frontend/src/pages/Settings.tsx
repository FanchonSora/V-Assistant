import {
  Container,
  Typography,
  Box,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

const Settings = () => {
  const { mode, toggleTheme } = useThemeContext();
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("settings.title")}
        </Typography>

        <Paper
          sx={{
            p: 3,
            mb: 3,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[2],
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("settings.appearance.title")}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={t("settings.appearance.darkMode")}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Settings;
