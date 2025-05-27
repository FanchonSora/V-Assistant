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
  Alert,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { post } from "../utils/api";
import type { GridProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Grid = MuiGrid as React.ComponentType<
  GridProps & {
    item?: boolean;
    container?: boolean;
    xs?: number;
    md?: number;
  }
>;

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number>(0);

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, navigate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setError("");
    setSuccess("");
    if (
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.termsAccepted
    ) {
      setError("Please fill in all fields and accept the Terms of Service.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await post("/auth/register", {
        username: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess("Account created successfully!");
      setCountdown(5);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Signup failed. Please try again."
      );
    }
  }, [form]);

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
                {t("signup.title", { defaultValue: "Sign Up" })}
              </Typography>

              <Box
                display="flex"
                alignItems="flex-end"
                mb={2}
                sx={{ width: "100%", maxWidth: 400 }}
              >
                <TextField
                  label="Your Name"
                  variant="standard"
                  fullWidth
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </Box>

              <Box
                display="flex"
                alignItems="flex-end"
                mb={2}
                sx={{ width: "100%", maxWidth: 400 }}
              >
                <TextField
                  label="Your Email"
                  variant="standard"
                  fullWidth
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Box>

              <Box
                display="flex"
                alignItems="flex-end"
                mb={2}
                sx={{ width: "100%", maxWidth: 400 }}
              >
                <TextField
                  label="Password"
                  variant="standard"
                  fullWidth
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </Box>

              <Box
                display="flex"
                alignItems="flex-end"
                mb={2}
                sx={{ width: "100%", maxWidth: 400 }}
              >
                <TextField
                  label="Repeat your password"
                  variant="standard"
                  fullWidth
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    name="termsAccepted"
                    checked={form.termsAccepted}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={t("signup.terms", {
                  defaultValue: "I agree to all statements in Terms of Service",
                })}
                sx={{ mb: 2, maxWidth: 400, width: "100%" }}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{ width: "100%", maxWidth: 400, mb: 2 }}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  sx={{ width: "100%", maxWidth: 400, mb: 2 }}
                >
                  {success} Redirecting to login page in {countdown} seconds...
                </Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ my: 2, maxWidth: 400 }}
                onClick={handleSubmit}
              >
                {t("signup.submit", { defaultValue: "Register" })}
              </Button>

              <Typography
                textAlign="center"
                sx={{ width: "100%", maxWidth: 400 }}
                component="div"
              >
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ cursor: "pointer", color: "black" }}
                >
                  {t("signup.alreadyMember", {
                    defaultValue: "I am already a member",
                  })}
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Signup;
