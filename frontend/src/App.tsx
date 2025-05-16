import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

import CalendarWeekPageWrapper from "./pages/CalendarWeekPageWrapper";
import CalendarDayPage from "./pages/CalendarDayPage";
import CalendarMonthPage from "./pages/CalendarMonthPage";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/calendar/day/:date" element={<CalendarDayPage  />} />
              <Route path="/calendar/week/:date" element={<CalendarWeekPageWrapper  />} />
              <Route path="/calendar/month/:date" element={<CalendarMonthPage  />} />
              <Route path="/calendar/:date" element={<CalendarWeekPageWrapper />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
