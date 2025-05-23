import React, { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";

const hours = Array.from({ length: 24 }, (_, i) => i); // 0h - 23h
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Function to format hour in 12-hour format
const formatHour = (hour: number): string => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "Noon";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
};

interface CalendarEvent {
  id: string;
  title: string;
  task_date: string;
  task_time: string;
  day: string;
}

const dummyEvents: CalendarEvent[] = [
  {
    id: "1",
    day: "Mon",
    task_time: "09:00",
    title: "Morning Meeting",
    task_date: "2024-03-18",
  },
  {
    id: "2",
    day: "Tue",
    task_time: "14:00",
    title: "Hangouts",
    task_date: "2024-03-19",
  },
  {
    id: "3",
    day: "Wed",
    task_time: "10:00",
    title: "Insurance & Risk",
    task_date: "2024-03-20",
  },
  {
    id: "4",
    day: "Thu",
    task_time: "09:00",
    title: "Boxing",
    task_date: "2024-03-21",
  },
  {
    id: "5",
    day: "Fri",
    task_time: "13:00",
    title: "Marketing",
    task_date: "2024-03-22",
  },
  {
    id: "6",
    day: "Sat",
    task_time: "10:00",
    title: "Logo Sketch",
    task_date: "2024-03-23",
  },
  {
    id: "7",
    day: "Sun",
    task_time: "09:00",
    title: "Morning Ritual",
    task_date: "2024-03-24",
  },
];

// Hàm lấy tên ngày dạng 3 ký tự (Sun, Mon...)
function getDayAbbreviation(date: Date): string {
  return days[date.getDay()];
}

export default function CalendarDayPage() {
  const { date } = useParams<{ date: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>(dummyEvents);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const inputDate = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [date]);

  const dayAbbr = useMemo(() => getDayAbbreviation(inputDate), [inputDate]);

  // Lọc event của ngày đó
  const eventsInDay = useMemo(
    () => events.filter((e) => e.day === dayAbbr),
    [dayAbbr, events]
  );

  // Hiển thị ngày dd/mm/yyyy
  const displayDate = useMemo(() => {
    const d = inputDate.getDate();
    const m = inputDate.getMonth() + 1;
    const y = inputDate.getFullYear();
    return `${d.toString().padStart(2, "0")}/${m
      .toString()
      .padStart(2, "0")}/${y}`;
  }, [inputDate]);

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

  return (
    <Box sx={{ p: 2, position: "relative" }}>
      <CalendarViewSelector />

      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: isDarkMode ? "#fff" : "inherit" }}
      >
        {displayDate} ({dayAbbr})
      </Typography>

      {/* Calendar grid */}
      <Box
        display="grid"
        gridTemplateColumns="80px 1fr"
        border={`1px solid ${isDarkMode ? "#fff" : theme.palette.divider}`}
        maxWidth={"100%"}
        minHeight={hours.length * 60}
      >
        {/* Column giờ */}
        <Box>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 60,
                borderBottom: `1px solid ${
                  isDarkMode ? "#fff" : theme.palette.divider
                }`,
                px: 1,
                fontSize: 12,
                color: isDarkMode ? "#fff" : "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                userSelect: "none",
              }}
            >
              {formatHour(hour)}
            </Box>
          ))}
        </Box>

        {/* Cột ngày */}
        <Box sx={{ position: "relative" }}>
          {/* Các ô giờ */}
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 60,
                borderBottom: `1px solid ${
                  isDarkMode ? "#fff" : theme.palette.divider
                }`,
                borderLeft: `1px solid ${
                  isDarkMode ? "#fff" : theme.palette.divider
                }`,
              }}
            />
          ))}

          {/* Render event */}
          {eventsInDay.map((event) => {
            const [hourStr, minuteStr] = event.task_time.split(":");
            const eventStartHour = parseInt(hourStr, 10);
            const eventStartMinute = parseInt(minuteStr, 10);
            const top =
              (eventStartHour - hours[0]) * 60 + (eventStartMinute / 60) * 60;
            const height = 60; // Fixed height for events

            // Nếu sự kiện ngoài khung giờ thì bỏ qua hiển thị
            if (
              eventStartHour < hours[0] ||
              eventStartHour >= hours[hours.length - 1] + 1
            )
              return null;

            return (
              <Paper
                key={event.id}
                elevation={3}
                onClick={() => handleEventClick(event)}
                sx={{
                  position: "absolute",
                  top,
                  left: 4,
                  right: 4,
                  height,
                  bgcolor: isDarkMode ? "#90caf9" : "primary.main",
                  color: isDarkMode ? "#000" : "primary.contrastText",
                  p: 1,
                  fontSize: 14,
                  overflow: "hidden",
                  borderRadius: 1,
                  cursor: "pointer",
                  userSelect: "none",
                  "&:hover": {
                    bgcolor: isDarkMode ? "#1976d2" : "primary.dark",
                  },
                }}
              >
                <Typography fontWeight="bold" noWrap>
                  {event.title}
                </Typography>
                <Typography fontSize={12}>{event.task_time}</Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>

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
