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
  Fab,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";

interface Appointment {
  id: string;
  date: Date;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

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
        <Typography variant="h4" component="h1" gutterBottom>
          {t("calendar.title", "Calendar")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ flex: 2 }}>
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
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                {t("calendar.appointments", "Appointments")}
              </Typography>
              {getAppointmentsForDate(selectedDate).map((appointment) => (
                <Box
                  key={appointment.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                  }}
                >
                  <Typography variant="subtitle1">
                    {appointment.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.startTime} - {appointment.endTime}
                  </Typography>
                  {appointment.description && (
                    <Typography variant="body2" color="text.secondary">
                      {appointment.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>

        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => setIsDialogOpen(true)}
        >
          <AddIcon />
        </Fab>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>
            {t("calendar.addAppointment", "Add Appointment")}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
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
                rows={2}
              />
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
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleAddAppointment} variant="contained">
              {t("common.add", "Add")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CalendarPage;
