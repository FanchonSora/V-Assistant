import {
  Container,
  Typography,
  Box,
  Paper,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useThemeContext } from "../context/ThemeContext";
import { useLanguageContext } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { mode, toggleTheme } = useThemeContext();
  const { language, setLanguage } = useLanguageContext();
  const { t } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value as "en" | "es" | "fr";
    setLanguage(newLang);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("settings.title")}
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
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

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("settings.language.title")}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="language-select-label">
              {t("settings.language.select")}
            </InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={language}
              label={t("settings.language.select")}
              onChange={handleLanguageChange}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>
    </Container>
  );
};

export default Settings;
