import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Chip,
  Paper,
  Tooltip,
  IconButton,
  ButtonGroup,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TodayIcon from "@mui/icons-material/Today";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface ViewOption {
  value: string;
  label: string;
  icon: React.ReactElement;
  description: string;
  shortcut: string;
}

const viewOptions: ViewOption[] = [
  {
    value: "day",
    label: "Day",
    icon: <CalendarViewDayIcon />,
    description: "Single day view",
    shortcut: "D",
  },
  {
    value: "week",
    label: "Week",
    icon: <CalendarViewWeekIcon />,
    description: "Week overview",
    shortcut: "W",
  },
  {
    value: "month",
    label: "Month",
    icon: <CalendarViewMonthIcon />,
    description: "Monthly calendar",
    shortcut: "M",
  },
];

const CalendarViewSelector = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [view, setView] = useState(() => {
    const path = window.location.pathname;
    if (path.includes("/day")) return "day";
    if (path.includes("/week")) return "week";
    if (path.includes("/month")) return "month";
    return "week";
  });

  const [currentDate, setCurrentDate] = useState(() => {
    if (date) {
      return new Date(date);
    }
    return new Date();
  });

  // Update current date when route changes
  useEffect(() => {
    if (date) {
      setCurrentDate(new Date(date));
    }
  }, [date]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "d":
            event.preventDefault();
            handleViewChange("day");
            break;
          case "w":
            event.preventDefault();
            handleViewChange("week");
            break;
          case "m":
            event.preventDefault();
            handleViewChange("month");
            break;
          case "t":
            event.preventDefault();
            goToToday();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleViewChange = (newView: string) => {
    setView(newView);
    const dateStr = formatDateForUrl(currentDate);
    navigate(`/calendar/${newView}/${dateStr}`);
  };

  const formatDateForUrl = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
    }

    setCurrentDate(newDate);
    const dateStr = formatDateForUrl(newDate);
    navigate(`/calendar/${view}/${dateStr}`);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    const dateStr = formatDateForUrl(today);
    navigate(`/calendar/${view}/${dateStr}`);
  };

  const getDateRangeText = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    };

    switch (view) {
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "month":
        return currentDate.toLocaleDateString("en-US", options);
      default:
        return "";
    }
  };

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  if (isMobile) {
    // Mobile compact view
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Date Navigation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              onClick={() => navigateDate("prev")}
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>

            <Box sx={{ textAlign: "center", flex: 1, mx: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {getDateRangeText()}
              </Typography>
            </Box>

            <IconButton
              onClick={() => navigateDate("next")}
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>

          {/* View Selector */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <ButtonGroup variant="outlined" size="small" fullWidth>
              {viewOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleViewChange(option.value)}
                  variant={view === option.value ? "contained" : "outlined"}
                  startIcon={option.icon}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>

            <Tooltip title="Go to Today (Ctrl+T)">
              <IconButton
                onClick={goToToday}
                size="small"
                color={isToday() ? "primary" : "default"}
                sx={{
                  bgcolor: isToday() ? "primary.light" : "background.paper",
                  boxShadow: 1,
                }}
              >
                <TodayIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Desktop full-featured view
  return (
    <Fade in timeout={300}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.secondary.light}10)`,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Left Section - Date Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Previous" arrow>
                <IconButton
                  onClick={() => navigateDate("prev")}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": {
                      bgcolor: "primary.light",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Next" arrow>
                <IconButton
                  onClick={() => navigateDate("next")}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": {
                      bgcolor: "primary.light",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {getDateRangeText()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {view.charAt(0).toUpperCase() + view.slice(1)} View
              </Typography>
            </Box>
          </Box>

          {/* Right Section - View Selector and Today Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Today Button */}
            <Tooltip title="Go to Today (Ctrl+T)" arrow>
              <Button
                onClick={goToToday}
                variant={isToday() ? "contained" : "outlined"}
                startIcon={<TodayIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  ...(isToday() && {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  }),
                }}
              >
                Today
              </Button>
            </Tooltip>

            {/* View Toggle Buttons */}
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => newView && handleViewChange(newView)}
              aria-label="calendar view"
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: "8px !important",
                  px: 2,
                  py: 1,
                  mx: 0.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 600,
                    boxShadow: 2,
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                },
              }}
            >
              {viewOptions.map((option) => (
                <Tooltip
                  key={option.value}
                  title={`${option.description} (Ctrl+${option.shortcut})`}
                  arrow
                >
                  <ToggleButton value={option.value} aria-label={option.label}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {option.icon}
                      <Typography variant="body2" fontWeight="inherit">
                        {option.label}
                      </Typography>
                    </Box>
                  </ToggleButton>
                </Tooltip>
              ))}
            </ToggleButtonGroup>

            {/* Active View Indicator */}
            <Chip
              icon={viewOptions.find((opt) => opt.value === view)?.icon}
              label={`${
                viewOptions.find((opt) => opt.value === view)?.label
              } Active`}
              variant="outlined"
              size="small"
              sx={{
                bgcolor: "primary.light",
                color: "primary.contrastText",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "inherit",
                },
              }}
            />
          </Box>
        </Box>

        {/* Bottom Status Bar */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Use Ctrl+D/W/M for quick view switching, Ctrl+T for today
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${currentDate.toLocaleDateString()}`}
              size="small"
              variant="outlined"
            />
            {!isToday() && (
              <Chip
                label="Not Today"
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CalendarViewSelector;
