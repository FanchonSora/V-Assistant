import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar"; // Import react-calendar
import "react-calendar/dist/Calendar.css"; // Import default styles

type Value = Date | null | [Date | null, Date | null];

// Add custom styles for the calendar
const calendarStyles = {
  width: "100%",
  border: "none",
  "& .react-calendar": {
    width: "100%",
    fontSize: "0.75rem",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "background.paper",
    color: "text.primary",
  },
  "& .react-calendar__navigation": {
    backgroundColor: "transparent",
    marginBottom: "4px",
  },
  "& .react-calendar__navigation button": {
    color: "text.primary",
    minWidth: "32px",
    background: "none",
    fontSize: "0.875rem",
    marginTop: "4px",
    padding: "4px",
    "&:enabled:hover": {
      backgroundColor: "action.hover",
    },
    "&:enabled:focus": {
      backgroundColor: "action.selected",
    },
  },
  "& .react-calendar__navigation__label": {
    fontWeight: "bold",
    color: "text.primary",
    fontSize: "0.875rem",
  },
  "& .react-calendar__month-view__weekdays": {
    backgroundColor: "transparent",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "0.75rem",
    color: "text.primary",
  },
  "& .react-calendar__month-view__weekdays__weekday": {
    padding: "4px",
  },
  "& .react-calendar__month-view__weekdays__weekday abbr": {
    textDecoration: "none",
    color: "text.primary",
  },
  "& .react-calendar__tile": {
    padding: "4px",
    fontSize: "0.75rem",
    color: "text.primary",
    "&:enabled:hover": {
      backgroundColor: "action.hover",
    },
    "&:enabled:focus": {
      backgroundColor: "action.selected",
    },
  },
  "& .react-calendar__tile--now": {
    backgroundColor: "action.selected",
    color: "text.primary",
    "&:enabled:hover": {
      backgroundColor: "action.hover",
    },
    "&:enabled:focus": {
      backgroundColor: "action.selected",
    },
  },
  "& .react-calendar__tile--active": {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
    "&:enabled:hover": {
      backgroundColor: "primary.dark",
    },
    "&:enabled:focus": {
      backgroundColor: "primary.dark",
    },
  },
  "& .react-calendar__tile--now .highlight": {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
    borderRadius: "50%",
    padding: "2px",
  },
  "& .react-calendar__month-view__days__day--neighboringMonth": {
    color: "text.disabled",
  },
  "& .react-calendar__month-view": {
    padding: "4px",
  },
};

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  { text: "Appointment", icon: <CalendarMonthIcon />, path: "/appointment" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());

  // Apply calendar theme variables
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme.palette.mode === "dark";

    root.style.setProperty(
      "--calendar-text-color",
      isDark ? "#ffffff" : "#000000"
    );
    root.style.setProperty(
      "--calendar-text-secondary",
      isDark ? "#b0bec5" : "#757575"
    );
    root.style.setProperty(
      "--calendar-hover-bg",
      isDark ? "#2c2c2c" : "#f8f8f8"
    );
    root.style.setProperty(
      "--calendar-today-bg",
      isDark ? "#1976d2" : "#ff9800"
    );
    root.style.setProperty(
      "--calendar-today-text",
      isDark ? "#ffffff" : "#000000"
    );
    root.style.setProperty(
      "--calendar-today-hover-bg",
      isDark ? "#1565c0" : "#1087ff"
    );
    root.style.setProperty("--calendar-today-hover-text", "#ffffff");
    root.style.setProperty(
      "--calendar-active-bg",
      isDark ? "#1976d2" : "#006edc"
    );
    root.style.setProperty("--calendar-active-text", "#ffffff");
    root.style.setProperty(
      "--calendar-active-hover-bg",
      isDark ? "#1565c0" : "#006edc"
    );
    root.style.setProperty("--calendar-active-hover-text", "#ffffff");
    root.style.setProperty(
      "--calendar-has-active-bg",
      isDark ? "#1976d2" : "#ff9800"
    );
    root.style.setProperty(
      "--calendar-has-active-text",
      isDark ? "#ffffff" : "#000000"
    );
    root.style.setProperty(
      "--calendar-has-active-hover-bg",
      isDark ? "#1565c0" : "#ffb74d"
    );
    root.style.setProperty(
      "--calendar-has-active-hover-text",
      isDark ? "#ffffff" : "#000000"
    );
  }, [theme.palette.mode]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDateClick = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
      const yyyy = value.getFullYear();
      const mm = String(value.getMonth() + 1).padStart(2, "0");
      const dd = String(value.getDate()).padStart(2, "0");
      navigate(`/calendar/${yyyy}-${mm}-${dd}`);
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          V-Assistant
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      {/* Mini Calendar */}
      <Box sx={{ p: 1 }}>
        <Box sx={calendarStyles}>
          <Calendar
            onChange={handleDateClick}
            value={date}
            calendarType="iso8601"
            tileClassName={({ date, view }) =>
              view === "month" &&
              date.toDateString() === new Date().toDateString()
                ? "highlight"
                : null
            }
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            V-Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px", // Height of AppBar
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)", // Subtract AppBar height
        }}
      >
        <Box sx={{ flex: 1 }}>{children}</Box>
        <Box
          component="footer"
          sx={{
            py: 3,
            mt: "auto",
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} V-Assistant. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
