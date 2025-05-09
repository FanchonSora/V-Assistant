import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const features = [
    {
      title: t("features.smartAssistant.title"),
      description: t("features.smartAssistant.description"),
    },
    {
      title: t("features.easyIntegration.title"),
      description: t("features.easyIntegration.description"),
    },
    {
      title: t("features.support.title"),
      description: t("features.support.description"),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          gutterBottom
          align="center"
        >
          {t("welcome.title")}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          {t("welcome.subtitle")}
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid
              key={index}
              sx={{
                display: "flex",
                width: { xs: "100%", sm: "50%", md: "33.33%" },
                p: 1,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body1" paragraph>
            {t("welcome.getStarted")}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
