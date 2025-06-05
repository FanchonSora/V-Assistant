import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import CalendarViewSelector from "../components/CalendarViewSelector";
import EventModal from "./EventModal";
import { getTasks } from "../utils/api";

import { deleteTask } from "../services/taskService";

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

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const inputDate = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [date]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const dateStr = inputDate.toISOString().slice(0, 10);
        const token = localStorage.getItem("token");

        const tasks = await getTasks(token ?? undefined, dateStr);

        const formattedTasks: CalendarEvent[] = tasks.map((task: any) => {
          const dateObj = new Date(task.task_date);
          return {
            id: task.id,
            title: task.title,
            task_date: task.task_date,
            task_time: task.task_time,
            day: days[dateObj.getDay()],
          };
        });

        setEvents(formattedTasks);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [inputDate]);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

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

  const handleEventDelete = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token") ?? "";
      await deleteTask(token, eventId);
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
      setModalOpen(false);
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      alert(`Error deleting task: ${error.message}`);
    }
  };
  

  return (
    <Box sx={{ p: 2, position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Daily Calendar
      </Typography>
      <CalendarViewSelector />

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
                borderBottom: `1px solid ${isDarkMode ? "#fff" : theme.palette.divider
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
                borderBottom: `1px solid ${isDarkMode ? "#fff" : theme.palette.divider
                  }`,
                borderLeft: `1px solid ${isDarkMode ? "#fff" : theme.palette.divider
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
