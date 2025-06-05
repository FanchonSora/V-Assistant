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
  Button,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Fade,
  Paper,
  Badge,
  Popover,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/AuthContext";

type Value = Date | null | [Date | null, Date | null];

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 320;
const collapsedDrawerWidth = 80;

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/", badge: null },
  { text: "Chat", icon: <ChatIcon />, path: "/chat", badge: null },
  { text: "Profile", icon: <PersonIcon />, path: "/profile", badge: null },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings", badge: null },
];

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarAnchor, setCalendarAnchor] = useState<null | HTMLElement>(
    null
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  const [date, setDate] = useState(new Date());
  const currentDrawerWidth = isMobile
    ? drawerWidth
    : isDrawerCollapsed
    ? collapsedDrawerWidth
    : drawerWidth;

  // Sync small calendar date with main calendar
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/calendar/")) {
      const dateStr = path.split("/calendar/")[1];
      const [year, month, day] = dateStr.split("-").map(Number);
      if (year && month && day) {
        setDate(new Date(year, month - 1, day));
      }
    }
  }, [location.pathname]);

  // Auto-collapse drawer on mobile
  useEffect(() => {
    if (isMobile) {
      setIsDrawerCollapsed(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    if (!isMobile) {
      setIsDrawerCollapsed(!isDrawerCollapsed);
    }
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

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/auth", { replace: true });
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleCalendarClick = (event: React.MouseEvent<HTMLElement>) => {
    setCalendarAnchor(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchor(null);
  };

  const calendarCustomStyles = {
    "& .react-calendar": {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.palette.mode === "dark" ? 3 : 1,
    },
    "& .react-calendar__navigation button": {
      color: theme.palette.text.primary,
      background: "none",
      borderRadius: 1,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    "& .react-calendar__month-view__weekdays": {
      color: theme.palette.text.secondary,
      fontWeight: 600,
    },
    "& .react-calendar__tile": {
      color: theme.palette.text.primary,
      borderRadius: 1,
      "&:enabled:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    "& .react-calendar__tile--now": {
      backgroundColor: "#FF9800",
      color: "#fff",
      fontWeight: 700,
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 2,
        left: "50%",
        transform: "translateX(-50%)",
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        backgroundColor: "#fff",
      },
      "&:enabled:hover": {
        backgroundColor: "#F57C00",
        color: "#fff",
      },
    },
    "& .react-calendar__tile--active": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontWeight: 700,
      "&:enabled:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    "& .react-calendar__month-view__days__day--neighboringMonth": {
      color: theme.palette.text.disabled,
    },
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!isDrawerCollapsed && (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              fontSize: "1.5rem",
              letterSpacing: "0.5px",
              background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            V-Assistant
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerCollapse} size="small">
            {isDrawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={isDrawerCollapsed ? item.text : ""}
            placement="right"
            arrow
          >
            <ListItem
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActiveRoute(item.path)
                  ? "primary.light"
                  : "transparent",
                color: isActiveRoute(item.path)
                  ? "primary.contrastText"
                  : "text.primary",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isActiveRoute(item.path)
                    ? "primary.main"
                    : "action.hover",
                  transform: "translateX(4px)",
                },
                justifyContent: isDrawerCollapsed ? "center" : "flex-start",
                px: isDrawerCollapsed ? 1 : 2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: isDrawerCollapsed ? "auto" : 40,
                  justifyContent: "center",
                }}
              >
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              {!isDrawerCollapsed && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}

        {/* Mini Calendar - only show when not collapsed */}
        {!isDrawerCollapsed && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Small Calendar
            </Typography>
            <Paper elevation={0}>
              <Box sx={calendarCustomStyles}>
                <Calendar
                  onChange={handleDateClick}
                  value={date}
                  showNeighboringMonth={false}
                  tileClassName={({ date, view }) =>
                    view === "month" &&
                    date.toDateString() === new Date().toDateString()
                      ? "highlight"
                      : null
                  }
                />
              </Box>
            </Paper>
          </Box>
        )}

        {/* Calendar Button for Collapsed State */}
        {isDrawerCollapsed && (
          <Tooltip title="Calendar" placement="right" arrow>
            <ListItem
              onClick={handleCalendarClick}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                mb: 1,
                justifyContent: "center",
                px: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: "auto",
                  justifyContent: "center",
                }}
              >
                <CalendarMonthIcon />
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        )}
      </List>

      {/* User info at bottom - only show when not collapsed */}
      {/* {!isDrawerCollapsed && isLoggedIn && (
        <Box sx={{ p: 2, mt: "auto", borderTop: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              {user?.name?.charAt(0) || "U"}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap fontWeight={600}>
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )} */}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
          height: "72px",
        }}
      >
        <Toolbar sx={{ height: "100%", minHeight: "72px !important" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600 }}
          >
            {menuItems.find((item) => isActiveRoute(item.path))?.text ||
              "Dashboard"}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isLoggedIn ? (
              <>
                {/* Profile Menu */}
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate("/auth")}
                sx={{ borderRadius: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, minWidth: 200 },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleProfileMenuClose();
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/settings");
            handleProfileMenuClose();
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Calendar Popover */}
      <Popover
        open={Boolean(calendarAnchor)}
        anchorEl={calendarAnchor}
        onClose={handleCalendarClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            p: 2,
            borderRadius: 2,
            "& .react-calendar": {
              border: "none",
              boxShadow: "none",
            },
          },
        }}
      >
        <Box sx={calendarCustomStyles}>
          <Calendar
            onChange={(value) => {
              handleDateClick(value);
              handleCalendarClose();
            }}
            value={date}
            showNeighboringMonth={false}
            tileClassName={({ date, view }) =>
              view === "month" &&
              date.toDateString() === new Date().toDateString()
                ? "highlight"
                : null
            }
          />
        </Box>
      </Popover>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "background.paper",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth,
              bgcolor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
              transition: "width 0.3s ease",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            mt: "64px",
            p: { xs: 2, sm: 3 },
            bgcolor: "grey.50",
            ...(theme.palette.mode === "dark" && {
              bgcolor: "grey.900",
            }),
          }}
        >
          <Fade in timeout={300}>
            <Box>{children}</Box>
          </Fade>
        </Box>

        {/* Enhanced Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 3,
            mt: "auto",
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} V-Assistant. All rights reserved.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip label="v2.1.0" size="small" variant="outlined" />
                <Chip
                  label="Online"
                  size="small"
                  color="success"
                  sx={{ backgroundColor: "success.light" }}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
