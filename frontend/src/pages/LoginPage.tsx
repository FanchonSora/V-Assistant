import {
  Container,
  Grid as MuiGrid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { useState, useCallback } from "react";
import type { GridProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const Grid = MuiGrid as React.ComponentType<
  GridProps & {
    item?: boolean;
    container?: boolean;
    xs?: number;
    md?: number;
  }
>;

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const Login = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const formData = new URLSearchParams();
    formData.append("username", form.username);
    formData.append("password", form.password);

      try {
      const res = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(`Login failed: ${errText}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      window.location.href = "/";
    } catch (err) {
    setError("An error occurred during login.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                textAlign="center"
              >
                {t("login.title", { defaultValue: "Log In" })}
              </Typography>

              <Box
                display="flex"
                alignItems="flex-end"
                mb={2}
                sx={{ width: "100%", maxWidth: 400 }}
              >
                <AccountCircle sx={{ mr: 1, color: "text.secondary" }} />
                <TextField
                  label={t("login.username", { defaultValue: "Your Name" })}
                  variant="standard"
                  fullWidth
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </Box>

              <Box
                display="flex"
                alignItems="flex-end"
                mb={2}
                sx={{ width: "100%", maxWidth: 400 }}
              >
                <LockIcon sx={{ mr: 1, color: "text.secondary" }} />
                <TextField
                  label={t("login.password", { defaultValue: "Password" })}
                  type="password"
                  variant="standard"
                  fullWidth
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={t("login.rememberMe", { defaultValue: "Remember me" })}
                sx={{ mb: 2, maxWidth: 400, width: "100%" }}
              />

              {error && (
                <Typography
                  color="error"
                  align="center"
                  sx={{ width: "100%", maxWidth: 400, mb: 1 }}
                >
                  {error}
                </Typography>
              )}

              {success && (
                <Typography
                  color="primary"
                  align="center"
                  sx={{ width: "100%", maxWidth: 400, mb: 1 }}
                >
                  {success}
                </Typography>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ my: 2, maxWidth: 400 }}
                onClick={handleLogin}
              >
                {t("login.submit", { defaultValue: "Log in" })}
              </Button>

              <Typography
                textAlign="center"
                sx={{ width: "100%", maxWidth: 400 }}
                component="div"
              >
                <Link href="/signup" underline="hover" sx={{ cursor: "pointer", color: "black" }}>
                  {t("login.createAccount", { defaultValue: "Create an account" })}
                </Link>
              </Typography>

              <Typography
                textAlign="center"
                mt={2}
                sx={{ width: "100%", maxWidth: 400 }}
              >
                {t("login.orLoginWith", { defaultValue: "Or login with" })}
              </Typography>

              <Box display="flex" justifyContent="center" gap={2} mt={1}>
                <IconButton color="primary">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="error">
                  <GoogleIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
