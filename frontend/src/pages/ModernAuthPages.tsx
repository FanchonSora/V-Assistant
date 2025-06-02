import React, {
  useState,
  useCallback,
  useEffect,
  type ChangeEvent,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Facebook,
  Twitter,
  Chrome,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@mui/material/styles";

const ModernAuthPages: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useAuth();
  const theme = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [countdown]);

  // After login countdown, navigate back or to "/
  useEffect(() => {
    if (countdown === 0 && success === "Login successful!" && isLogin) {
      let dest = "/";
      const state = location.state as unknown;
      function isFromState(
        obj: unknown
      ): obj is { from: { pathname: string } } {
        return (
          typeof obj === "object" &&
          obj !== null &&
          "from" in obj &&
          typeof (obj as { from?: unknown }).from === "object" &&
          (obj as { from: { pathname?: unknown } }).from !== null &&
          "pathname" in (obj as { from: { pathname?: unknown } }).from &&
          typeof (obj as { from: { pathname: unknown } }).from.pathname ===
            "string"
        );
      }
      if (isFromState(state)) {
        dest = state.from.pathname;
      }
      navigate(dest, { replace: true });
    }
  }, [countdown, success, isLogin, navigate, location.state]);

  useEffect(() => {
    if (success === "Account created successfully!") {
      const timer = setTimeout(() => {
        setSuccess("");
        setIsLogin(true); // Switch to login form
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleLoginChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSignupChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!loginForm.username || !loginForm.password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.detail === "Bad credentials") {
          setError("Wrong username or password");
        } else {
          setError(data.detail || "Login failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      contextLogin();
      setSuccess("Login successful!");
      setCountdown(1); // quick redirect
      navigate("/"); // Go to Home page
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hide error after 3 seconds
  useEffect(() => {
    if (error === "Wrong username or password") {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignup = async () => {
    setError("");
    setIsLoading(true);
    if (
      !signupForm.username ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword ||
      !signupForm.termsAccepted
    ) {
      setError("Please fill in all fields and accept the Terms of Service.");
      setIsLoading(false);
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Signup failed. Please try again.");
        setIsLoading(false);
        return;
      }
      setSuccess("Account created successfully!");
      setCountdown(5);
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setCountdown(0);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    wrapper: {
      width: "100%",
      maxWidth: "28rem",
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "2rem",
    },
    logoBox: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "4rem",
      height: "4rem",
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: "1rem",
      marginBottom: "1.5rem",
      boxShadow: theme.shadows[4],
    },
    title: {
      fontSize: "1.875rem",
      fontWeight: "bold" as const,
      color: theme.palette.text.primary,
      marginBottom: "0.5rem",
      margin: 0,
    },
    subtitle: {
      color: theme.palette.text.secondary,
      margin: 0,
    },
    card: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "1.5rem",
      boxShadow: theme.shadows[8],
      padding: "2rem",
      backdropFilter: "blur(10px)",
      border: `1px solid ${theme.palette.divider}`,
    },
    tabContainer: {
      display: "flex",
      backgroundColor: "#f3f4f6",
      borderRadius: "1rem",
      padding: "0.25rem",
      marginBottom: "2rem",
    },
    tab: {
      flex: 1,
      padding: "0.75rem 1rem",
      borderRadius: "0.75rem",
      fontWeight: "600" as const,
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "0.875rem",
    },
    tabActive: {
      backgroundColor: "white",
      color: "#4f46e5",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    tabInactive: {
      color: "#6b7280",
      backgroundColor: "transparent",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "1.5rem",
    },
    inputContainer: {
      position: "relative" as const,
    },
    inputIcon: {
      position: "absolute" as const,
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none" as React.CSSProperties["pointerEvents"],
    },
    input: {
      width: "100%",
      padding: "1rem 1rem 1rem 3rem",
      border: "1px solid #e5e7eb",
      borderRadius: "1rem",
      fontSize: "1rem",
      color: "#000",
      transition: "all 0.2s ease",
      backgroundColor: "rgba(249, 250, 251, 0.5)",
      boxSizing: "border-box" as const,
      outline: "none",
    },
    inputWithRightIcon: {
      paddingRight: "3rem",
    },
    inputFocus: {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
      backgroundColor: "white",
    },
    eyeButton: {
      position: "absolute" as const,
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#9ca3af",
      padding: "0.25rem",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.75rem",
    },
    checkbox: {
      marginTop: "0.125rem",
      width: "1rem",
      height: "1rem",
      accentColor: "#4f46e5",
    },
    checkboxLabel: {
      fontSize: "0.875rem",
      color: "#6b7280",
      lineHeight: "1.5",
    },
    link: {
      color: "#4f46e5",
      textDecoration: "none",
      fontWeight: "500",
    },
    alert: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "1rem",
      borderRadius: "1rem",
      fontSize: "0.875rem",
      border: "1px solid",
    },
    alertError: {
      backgroundColor: "#fef2f2",
      borderColor: "#fecaca",
      color: "#dc2626",
    },
    alertSuccess: {
      backgroundColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      color: "#16a34a",
    },
    button: {
      width: "100%",
      background: "linear-gradient(45deg, #4f46e5, #06b6d4)",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "1rem",
      fontWeight: "600" as const,
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
    },
    buttonHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 6px 20px rgba(79, 70, 229, 0.4)",
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      transform: "none",
    },
    spinner: {
      width: "1.5rem",
      height: "1.5rem",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    forgotPassword: {
      textAlign: "center" as const,
      marginTop: "1rem",
    },
    divider: {
      margin: "2rem 0",
      position: "relative" as const,
      textAlign: "center" as const,
    },
    dividerLine: {
      position: "absolute" as const,
      top: "50%",
      left: 0,
      right: 0,
      height: "1px",
      backgroundColor: "#e5e7eb",
    },
    dividerText: {
      backgroundColor: "white",
      padding: "0 1rem",
      color: "#6b7280",
      fontSize: "0.875rem",
    },
    socialContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.75rem",
      marginTop: "1.5rem",
    },
    socialButton: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0.75rem",
      border: "1px solid #e5e7eb",
      borderRadius: "1rem",
      backgroundColor: "white",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    socialButtonHover: {
      backgroundColor: "#f9fafb",
    },
    toggleContainer: {
      marginTop: "2rem",
      textAlign: "center" as const,
    },
    toggleText: {
      color: "#6b7280",
      margin: 0,
    },
    toggleButton: {
      color: "#4f46e5",
      fontWeight: "600" as const,
      background: "none",
      border: "none",
      cursor: "pointer",
      textDecoration: "none",
      transition: "color 0.2s ease",
    },
    footer: {
      textAlign: "center" as const,
      marginTop: "2rem",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .input-focus:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
          background-color: white !important;
        }
        .button-hover:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
        }
        .social-hover:hover {
          background-color: #f9fafb !important;
        }
        .tab-inactive:hover {
          color: #4b5563;
        }
        .link-hover:hover {
          color: #3730a3;
          text-decoration: underline;
        }
        .toggle-hover:hover {
          color: #3730a3;
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <Lock color="white" size={32} />
          </div>
          <h1 style={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={styles.subtitle}>
            {isLogin
              ? "Sign in to your account to continue"
              : "Join us today and get started"}
          </p>
        </div>

        {/* Main Card */}
        <div style={styles.card}>
          {/* Tab Switcher */}
          <div style={styles.tabContainer}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                ...styles.tab,
                ...(isLogin ? styles.tabActive : styles.tabInactive),
              }}
              className={!isLogin ? "tab-inactive" : ""}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                ...styles.tab,
                ...(!isLogin ? styles.tabActive : styles.tabInactive),
              }}
              className={isLogin ? "tab-inactive" : ""}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <div style={styles.formContainer}>
            {/* Add Username input for Sign Up */}
            {!isLogin && (
              <div style={styles.inputContainer}>
                <div style={styles.inputIcon}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={signupForm.username}
                  onChange={handleSignupChange}
                  placeholder="Username"
                  style={styles.input}
                  className="input-focus"
                />
              </div>
            )}

            {/* Username/Email input */}
            <div style={styles.inputContainer}>
              <div style={styles.inputIcon}>
                {isLogin ? <User size={20} /> : <Mail size={20} />}
              </div>
              <input
                type={isLogin ? "text" : "email"}
                name={isLogin ? "username" : "email"}
                value={isLogin ? loginForm.username : signupForm.email}
                onChange={isLogin ? handleLoginChange : handleSignupChange}
                placeholder={isLogin ? "Username" : "Email Address"}
                style={styles.input}
                className="input-focus"
              />
            </div>

            <div style={styles.inputContainer}>
              <div style={styles.inputIcon}>
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={isLogin ? loginForm.password : signupForm.password}
                onChange={isLogin ? handleLoginChange : handleSignupChange}
                placeholder="Password"
                style={{ ...styles.input, ...styles.inputWithRightIcon }}
                className="input-focus"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLogin && (
              <div style={styles.inputContainer}>
                <div style={styles.inputIcon}>
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm Password"
                  style={{ ...styles.input, ...styles.inputWithRightIcon }}
                  className="input-focus"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            )}

            {!isLogin && (
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={signupForm.termsAccepted}
                  onChange={handleSignupChange}
                  style={styles.checkbox}
                />
                <label style={styles.checkboxLabel}>
                  I agree to the{" "}
                  <a href="#" style={styles.link} className="link-hover">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" style={styles.link} className="link-hover">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div style={{ ...styles.alert, ...styles.alertError }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{ ...styles.alert, ...styles.alertSuccess }}>
                <CheckCircle2 size={20} />
                <div>
                  <div>{success}</div>
                  {countdown > 0 && (
                    <div style={{ marginTop: "0.25rem" }}>
                      Redirecting in {countdown} seconds...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={isLogin ? handleLogin : handleSignup}
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {}),
              }}
              className="button-hover"
            >
              {isLoading ? (
                <div style={styles.spinner} />
              ) : (
                <>
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div style={styles.forgotPassword}>
                <a
                  href="#"
                  style={{ ...styles.link, fontSize: "0.875rem" }}
                  className="link-hover"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </div>

          {/* Social Login */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Or continue with</span>
          </div>

          <div style={styles.socialContainer}>
            <button style={styles.socialButton} className="social-hover">
              <Facebook size={20} color="#1877f2" />
            </button>
            <button style={styles.socialButton} className="social-hover">
              <Twitter size={20} color="#1da1f2" />
            </button>
            <button style={styles.socialButton} className="social-hover">
              <Chrome size={20} color="#ea4335" />
            </button>
          </div>

          {/* Toggle Link */}
          <div style={styles.toggleContainer}>
            <p style={styles.toggleText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                style={styles.toggleButton}
                className="toggle-hover"
              >
                {isLogin ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAuthPages;
