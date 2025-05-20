import { Box, Typography, Fab, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";

const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8am - 8pm
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  day: string;
}

const dummyEvents: Event[] = [
  {
    id: "1",
    day: "Mon",
    time: "09:00",
    title: "Morning Meeting",
    date: "2024-03-18",
  },
  {
    id: "2",
    day: "Tue",
    time: "14:00",
    title: "Hangouts",
    date: "2024-03-19",
  },
  {
    id: "3",
    day: "Wed",
    time: "10:00",
    title: "Insurance & Risk",
    date: "2024-03-20",
  },
  {
    id: "4",
    day: "Thu",
    time: "09:00",
    title: "Boxing",
    date: "2024-03-21",
  },
  {
    id: "5",
    day: "Fri",
    time: "13:00",
    title: "Marketing",
    date: "2024-03-22",
  },
  {
    id: "6",
    day: "Sat",
    time: "10:00",
    title: "Logo Sketch",
    date: "2024-03-23",
  },
  {
    id: "7",
    day: "Sun",
    time: "09:00",
    title: "Morning Ritual",
    date: "2024-03-24",
  },
];

export default function CalendarWeekView() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(dummyEvents);

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
    const map: { [key: string]: Event[] } = {};
    days.forEach((d) => (map[d] = []));
    events.forEach((e) => map[e.day].push(e));
    return map;
  }, [events]);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  }, []);

  const handleEventEdit = useCallback((editedEvent: Event) => {
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
                  bgcolor: "#e3f2fd",
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
              {hour}:00
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
                  .filter((e) => parseInt(e.time.split(":")[0]) === hour)
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
