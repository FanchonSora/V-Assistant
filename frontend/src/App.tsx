import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import AppointmentPage from "./pages/Appointment";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/calendar.css";

import CalendarWeekPageWrapper from "./pages/CalendarWeekPageWrapper";
import CalendarDayPage from "./pages/CalendarDayPage";
import CalendarMonthPage from "./pages/CalendarMonthPage";

import Signup from "./pages/SignUpPage";
import Login from "./pages/LoginPage";

import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/calendar/day/:date" element={<CalendarDayPage />} />
            <Route
              path="/calendar/week/:date"
              element={<CalendarWeekPageWrapper />}
            />
            <Route
              path="/calendar/month/:date"
              element={<CalendarMonthPage />}
            />
            <Route
              path="/calendar/:date"
              element={<CalendarWeekPageWrapper />}
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
