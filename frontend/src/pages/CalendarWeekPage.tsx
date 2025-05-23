import { Box, Typography, Fab, Paper, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";

import { getTasks } from "../utils/api";

const hours = Array.from({ length: 24 }, (_, i) => i); // 0h - 23h
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Function to format hour in 12-hour format
const formatHour = (hour: number): string => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "Noon";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
};

const formatDate = (date: Date) => date.toISOString().split("T")[0];

interface CalendarEvent {
  id: string;
  title: string;
  task_date: string;
  task_time: string;
  day: string;
}

export default function CalendarWeekView() {
  const { date } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getTasks(token ?? undefined)
      .then((data) => {
        const cleanedData: CalendarEvent[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          task_date: item.task_date,
          task_time: item.task_time,
          day: item.day,
        }));
        setEvents(cleanedData);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const inputDate = useMemo(() => {
    const parsed = date ? new Date(date) : new Date();
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [date]);

  const getMonday = (d: Date) => {
    const copy = new Date(d);
    const day = copy.getDay();
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(copy.setDate(diff));
  };

  const startDate = useMemo(() => getMonday(inputDate), [inputDate]);

  const eventsByDay = useMemo(() => {
    const map: { [key: string]: CalendarEvent[] } = {};
    days.forEach((d) => (map[d] = []));

    events.forEach((event) => {
      const eventDate = new Date(event.task_date);

      const eventTime = eventDate.getTime();
      const startTime = startDate.getTime();
      const endTime = new Date(startDate);
      endTime.setDate(startDate.getDate() + 7);

      if (eventTime >= startTime && eventTime < endTime.getTime()) {
        const eventDayIndex = eventDate.getDay();
        const dayLabel = days[(eventDayIndex + 6) % 7];

        map[dayLabel].push(event);
      }
    });
    return map;
  }, [events, startDate]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  }, []);

  const handleEventEdit = useCallback((editedEvent: CalendarEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === editedEvent.id ? editedEvent : e))
    );
  }, []);

  const handleEventDelete = useCallback((eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
  }, []);

  const handleDayClick = useCallback(
    (day: Date) => {
      const formattedDate = formatDate(day);
      navigate(`/calendar/day/${formattedDate}`);
    },
    [navigate]
  );

  return (
    <Box sx={{ position: "relative", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Weekly Calendar
      </Typography>

      <CalendarViewSelector />

      {/* Calendar grid */}
      <Box
        display="grid"
        gridTemplateColumns="80px repeat(7, 1fr)"
        border="1px solid #ccc"
      >
        {/* Header row */}
        <Box />
        {days.map((day, index) => {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + index);
          const dayNumber = date.getDate();
          const monthNumber = date.getMonth() + 1;

          return (
            <Box
              key={day}
              onClick={() => handleDayClick(date)}
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                py: 1,
                borderLeft: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isDarkMode ? "#1e1e1e" : "#e3f2fd",
                },
              }}
            >
              <Typography variant="subtitle1">{day}</Typography>
              <Typography variant="caption">
                {dayNumber}/{monthNumber}
              </Typography>
            </Box>
          );
        })}

        {/* Time rows */}
        {hours.map((hour) => (
          <Box key={`row-${hour}`} display="contents">
            {/* Time label */}
            <Box sx={{ borderTop: "1px solid #ccc", p: 1, fontSize: 12 }}>
              {formatHour(hour)}
            </Box>
            {/* Day columns */}
            {days.map((day) => (
              <Box
                key={`${day}-${hour}`}
                sx={{
                  borderTop: "1px solid #eee",
                  borderLeft: "1px solid #ccc",
                  height: 60,
                  position: "relative",
                }}
              >
                {eventsByDay[day]
                  .filter((e) => parseInt(e.task_time.split(":")[0]) === hour)
                  .map((e) => (
                    <Paper
                      key={e.id}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 4,
                        right: 4,
                        height: 60,
                        bgcolor: "#1976d2",
                        color: "#fff",
                        p: 1,
                        fontSize: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEventClick(e)}
                    >
                      {e.title}
                    </Paper>
                  ))}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Add button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 10,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Event Modal */}
      <EventModal
        open={modalOpen}
        event={selectedEvent}
        onClose={() => setModalOpen(false)}
        onDelete={handleEventDelete}
        onEdit={handleEventEdit}
      />
    </Box>
  );
}
