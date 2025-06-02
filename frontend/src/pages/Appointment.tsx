import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

interface Appointment {
  id: string;
  date: Date;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

const formatTimeTo12Hour = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const calendarStyles = {
  width: "100%",
  border: "none",
  "& .react-calendar": {
    width: "100%",
    fontSize: "1rem",
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
    minWidth: "44px",
    background: "none",
    fontSize: "1rem",
    marginTop: "8px",
    padding: "8px",
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
    fontSize: "1rem",
  },
  "& .react-calendar__month-view__weekdays": {
    backgroundColor: "transparent",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "0.875rem",
    color: "text.primary",
  },
  "& .react-calendar__month-view__weekdays__weekday": {
    padding: "8px",
  },
  "& .react-calendar__month-view__weekdays__weekday abbr": {
    textDecoration: "none",
    color: "text.primary",
  },
  "& .react-calendar__tile": {
    padding: "8px",
    fontSize: "0.875rem",
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
    padding: "4px",
  },
  "& .react-calendar__month-view__days__day--neighboringMonth": {
    color: "text.disabled",
  },
  "& .react-calendar__month-view": {
    padding: "8px",
  },
};

const CalendarPage = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const theme = useTheme();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = () => {
    if (
      newAppointment.title &&
      newAppointment.startTime &&
      newAppointment.endTime
    ) {
      const appointment: Appointment = {
        id: Date.now().toString(),
        date: selectedDate,
        title: newAppointment.title,
        description: newAppointment.description || "",
        startTime: newAppointment.startTime,
        endTime: newAppointment.endTime,
      };
      setAppointments([...appointments, appointment]);
      setIsDialogOpen(false);
      setNewAppointment({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
      });
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(
      (apt) =>
        apt.date.getDate() === date.getDate() &&
        apt.date.getMonth() === date.getMonth() &&
        apt.date.getFullYear() === date.getFullYear()
    );
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dayAppointments = getAppointmentsForDate(date);
    return dayAppointments.length > 0 ? (
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "primary.main",
        }}
      />
    ) : null;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mt: 3,
            mb: 4,
            fontWeight: 600,
            color: theme.palette.text.primary,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              borderRadius: 2,
            },
          }}
        >
          {t("appointment.title", "Appointment")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ flex: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={calendarStyles}>
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  onClickDay={handleDateClick}
                  tileContent={tileContent}
                  className="calendar"
                />
              </Box>
            </Paper>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsDialogOpen(true)}
              sx={{
                mt: 2,
                width: "100%",
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
                "&:active": {
                  transform: "translateY(0) scale(0.98)",
                },
              }}
            >
              {t("calendar.addAppointment", "Add Appointment")}
            </Button>
          </Box>

          <Box sx={{ flex: 7 }}>
            <Paper sx={{ p: 2, height: "200%" }}>
              <Typography variant="h6" gutterBottom>
                {t("appointment.appointments", "Appointments")}
              </Typography>
              {getAppointmentsForDate(selectedDate).map((appointment) => (
                <Box
                  key={appointment.id}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.05
                    )}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 16px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    },
                  }}
                >
                  <Box sx={{ pl: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {appointment.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {formatTimeTo12Hour(appointment.startTime)} -{" "}
                        {formatTimeTo12Hour(appointment.endTime)}
                      </Typography>
                    </Box>
                    {appointment.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mt: 1,
                          lineHeight: 1.6,
                          pl: 0.5,
                        }}
                      >
                        {appointment.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: { xs: "90%", sm: 500 },
              maxWidth: 600,
              overflow: "hidden",
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              py: 3,
              px: 4,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${alpha(
                  theme.palette.primary.light,
                  0.5
                )} 0%, ${alpha(theme.palette.primary.main, 0.5)} 100%)`,
              },
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {t("calendar.addAppointment", "Add Appointment")}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                label={t("calendar.title", "Title")}
                value={newAppointment.title}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    title: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  },
                }}
              />
              <TextField
                label={t("calendar.description", "Description")}
                value={newAppointment.description}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    description: e.target.value,
                  })
                }
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  },
                }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label={t("calendar.startTime", "Start Time")}
                  type="time"
                  value={newAppointment.startTime}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      startTime: e.target.value,
                    })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    step: 300, // 5 min
                    format: "12h",
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    },
                  }}
                />
                <TextField
                  label={t("calendar.endTime", "End Time")}
                  type="time"
                  value={newAppointment.endTime}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      endTime: e.target.value,
                    })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    step: 300, // 5 min
                    format: "12h",
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              px: 4,
              py: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              gap: 2,
            }}
          >
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleAddAppointment}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {t("common.add", "Add")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CalendarPage;
