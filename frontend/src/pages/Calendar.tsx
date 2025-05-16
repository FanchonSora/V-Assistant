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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              <Calendar
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
                onClickDay={handleDateClick}
                tileContent={tileContent}
                className="calendar"
              />
            </Paper>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 2, position: "relative", minHeight: "400px" }}>
              <Typography variant="h6" gutterBottom>
                {formatDate(selectedDate)}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {getAppointmentsForDate(selectedDate).map((apt) => (
                  <Box key={apt.id} sx={{ mb: 2, p: 1, bgcolor: "grey.100" }}>
                    <Typography variant="subtitle1">{apt.title}</Typography>
                    <Typography variant="body2">
                      {apt.startTime} - {apt.endTime}
                    </Typography>
                    {apt.description && (
                      <Typography variant="body2" color="text.secondary">
                        {apt.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => setIsDialogOpen(true)}
                sx={{ position: "absolute", bottom: 16, right: 16 }}
              >
                <AddIcon />
              </Fab>
            </Paper>
          </Box>
        </Box>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {t("calendar.addAppointment", "Add Appointment")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={t("calendar.title", "Title")}
              value={newAppointment.title}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, title: e.target.value })
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
    </Container>
  );
};

export default CalendarPage;
