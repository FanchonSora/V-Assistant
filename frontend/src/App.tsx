// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import ModernAuthPages from "./pages/ModernAuthPages";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles/calendar.css";

import CalendarWeekPageWrapper from "./pages/CalendarWeekPageWrapper";
import CalendarDayPage from "./pages/CalendarDayPage";
import CalendarMonthPage from "./pages/CalendarMonthPage";

import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public: no Layout */}
            <Route path="/auth" element={<ModernAuthPages />} />

            {/* Anything else needs Layout + auth */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar/day/:date"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CalendarDayPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar/week/:date"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CalendarWeekPageWrapper />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar/month/:date"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CalendarMonthPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar/:date"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CalendarWeekPageWrapper />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
