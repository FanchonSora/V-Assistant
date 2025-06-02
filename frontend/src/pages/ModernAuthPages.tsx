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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

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

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSignupChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
    if (name === "email") {
      const error = validateEmail(value);
      setEmailError(error);
    }
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
    if (emailError) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (passwordError) {
      setError("Please fix the password requirements.");
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
      marginBottom: "1rem",
    },
    inputIcon: {
      position: "absolute" as const,
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none" as React.CSSProperties["pointerEvents"],
      zIndex: 1,
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
      zIndex: 1,
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
    passwordRequirements: {
      marginTop: "0.5rem",
      padding: "0.75rem",
      backgroundColor: "#f9fafb",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
    },
    requirementsTitle: {
      margin: "0 0 0.5rem",
      color: "#374151",
      fontWeight: "500",
    },
    requirementsList: {
      margin: 0,
      paddingLeft: "1.25rem",
      listStyleType: "disc",
    },
    inputError: {
      borderColor: "#dc2626",
      backgroundColor: "#fef2f2",
    },
    errorMessage: {
      color: "#dc2626",
      fontSize: "0.75rem",
      marginTop: "0.25rem",
      marginLeft: "0.5rem",
    },
    linkButton: {
      background: "none",
      border: "none",
      color: "#4f46e5",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      textDecoration: "none",
    },
    modalOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      opacity: 0,
      animation: "fadeIn 0.3s ease forwards",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "1rem",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "80vh",
      overflow: "auto",
      position: "relative" as const,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transform: "scale(0.95)",
      animation: "slideIn 0.3s ease forwards",
    },
    modalHeader: {
      padding: "1.5rem",
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky" as const,
      top: 0,
      backgroundColor: "white",
      zIndex: 1,
    },
    modalTitle: {
      margin: 0,
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#111827",
    },
    modalCloseButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      color: "#6b7280",
      cursor: "pointer",
      padding: "0.5rem",
      lineHeight: 1,
      borderRadius: "0.375rem",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f3f4f6",
        color: "#374151",
      },
    },
    modalBody: {
      padding: "1.5rem",
      color: "#374151",
      "& h3": {
        margin: "1.5rem 0 0.75rem",
        fontSize: "1.125rem",
        fontWeight: "600",
        color: "#111827",
      },
      "& p": {
        margin: "0.5rem 0",
        lineHeight: 1.5,
      },
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideOut {
          from { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to { 
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }
        .modal-enter {
          animation: fadeIn 0.3s ease forwards;
        }
        .modal-exit {
          animation: fadeOut 0.3s ease forwards;
        }
        .modal-content-enter {
          animation: slideIn 0.3s ease forwards;
        }
        .modal-content-exit {
          animation: slideOut 0.3s ease forwards;
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
                style={{
                  ...styles.input,
                  ...(emailError && !isLogin ? styles.inputError : {}),
                }}
                className="input-focus"
              />
              {!isLogin && emailError && (
                <div style={styles.errorMessage}>{emailError}</div>
              )}
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

            {!isLogin && signupForm.password && (
              <div style={styles.passwordRequirements}>
                <p style={styles.requirementsTitle}>Password must contain:</p>
                <ul style={styles.requirementsList}>
                  <li
                    style={{
                      color:
                        signupForm.password.length >= 8 ? "#16a34a" : "#6b7280",
                    }}
                  >
                    At least 8 characters
                  </li>
                  <li
                    style={{
                      color: /[A-Z]/.test(signupForm.password)
                        ? "#16a34a"
                        : "#6b7280",
                    }}
                  >
                    One uppercase letter
                  </li>
                  <li
                    style={{
                      color: /[a-z]/.test(signupForm.password)
                        ? "#16a34a"
                        : "#6b7280",
                    }}
                  >
                    One lowercase letter
                  </li>
                  <li
                    style={{
                      color: /\d/.test(signupForm.password)
                        ? "#16a34a"
                        : "#6b7280",
                    }}
                  >
                    One number
                  </li>
                </ul>
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
                  <button
                    onClick={() => setShowTermsModal(true)}
                    style={styles.linkButton}
                    className="link-hover"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    style={styles.linkButton}
                    className="link-hover"
                  >
                    Privacy Policy
                  </button>
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

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div
          style={styles.modalOverlay}
          className="modal-enter"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTermsModal(false);
            }
          }}
        >
          <div style={styles.modalContent} className="modal-content-enter">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Terms of Service</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                style={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing and using this application, you accept and agree to
                be bound by the terms and provision of this agreement.
              </p>

              <h3>2. Use License</h3>
              <p>
                Permission is granted to temporarily use this application for
                personal, non-commercial transitory viewing only.
              </p>

              <h3>3. User Account</h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password.
              </p>

              <h3>4. User Conduct</h3>
              <p>
                You agree to use the application only for lawful purposes and in
                accordance with these Terms.
              </p>

              <h3>5. Termination</h3>
              <p>
                We may terminate or suspend your account and bar access to the
                application immediately, without prior notice or liability.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div
          style={styles.modalOverlay}
          className="modal-enter"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPrivacyModal(false);
            }
          }}
        >
          <div style={styles.modalContent} className="modal-content-enter">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                style={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <h3>1. Information We Collect</h3>
              <p>
                We collect information that you provide directly to us,
                including your name, email address, and any other information
                you choose to provide.
              </p>

              <h3>2. How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and
                improve our services.
              </p>

              <h3>3. Information Sharing</h3>
              <p>
                We do not share your personal information with third parties
                except as described in this privacy policy.
              </p>

              <h3>4. Data Security</h3>
              <p>
                We take reasonable measures to help protect your personal
                information from loss, theft, misuse, and unauthorized access.
              </p>

              <h3>5. Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal
                information.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAuthPages;
