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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/AuthContext";

type Value = Date | null | [Date | null, Date | null];

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;
const collapsedDrawerWidth = 70;

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/", badge: null },
  { text: "Profile", icon: <PersonIcon />, path: "/profile", badge: null },
  {
    text: "Appointments",
    icon: <CalendarMonthIcon />,
    path: "/appointment",
    badge: 3,
  },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings", badge: null },
];

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, user } = useAuth();

  const [date, setDate] = useState(new Date());
  const currentDrawerWidth = isMobile
    ? drawerWidth
    : isDrawerCollapsed
    ? collapsedDrawerWidth
    : drawerWidth;

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

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/auth", { replace: true });
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
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
            sx={{ fontWeight: 700, color: "primary.main" }}
          ></Typography>
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
      </List>

      {/* Mini Calendar - only show when not collapsed */}
      {!isDrawerCollapsed && (
        <Box sx={{ px: 2, py: 1, mt: "auto" }}>
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
        }}
      >
        <Toolbar>
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
                {/* Notifications */}
                <IconButton
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{ mx: 1 }}
                >
                  <Badge badgeContent={5} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Profile Menu */}
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{ width: 36, height: 36, bgcolor: "primary.main" }}
                  >
                    {user?.name?.charAt(0) || "U"}
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

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1, minWidth: 300, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <MenuItem>
          <Box>
            <Typography variant="body2">New appointment scheduled</Typography>
            <Typography variant="caption" color="text.secondary">
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="body2">
              Profile updated successfully
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

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
